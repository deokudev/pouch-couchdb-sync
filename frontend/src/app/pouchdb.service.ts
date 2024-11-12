import { Injectable } from "@angular/core";
import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PouchDbService {
  private data: any[] = [];
  private db!: PouchDB.Database;
  private remoteCouchDbUrl: string = "";

  constructor() {
    PouchDB.plugin(PouchDBFind); // PouchDB Find 플러그인 등록
  }

  init(details: any): void {
    // info : 사용자별 정의해야, 타 계정간 겹치는 불상사를 막을 수 있음
    this.db = new PouchDB(`personal$${details.user_id}`);
    this.remoteCouchDbUrl = details.userDBs.personal.replace(
      /127.0.0.1:5984/,
      environment.couchUrl.replace(/^https?:\/\//, "")
    );

    this.db.sync(this.remoteCouchDbUrl, {
      // 양방향 동기화 활성화
      live: true,
      // 장애 시, 재시도 활성화
      retry: true,
    });

    console.log("Database initialized:", this.db);
  }

  async logout(): Promise<void> {
    this.data = [];
    try {
      // 로그아웃 시, 로그인한 사용자의 db를 브라우저에서 삭제
      await this.db.destroy();
      console.log("Database removed");
    } catch (error) {
      console.error("Error removing database:", error);
    }
  }

  async getDocuments(): Promise<any[]> {
    if (this.data.length) return this.data;

    try {
      const result = await this.db.allDocs({ include_docs: true });
      this.data = result.rows.map((row) => row.doc);

      this.db
        .changes({ live: true, since: "now", include_docs: true })
        .on("change", (change) => this.handleChange(change));

      return this.data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  }

  async createDocument(document: any): Promise<void> {
    try {
      await this.db.post(document);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  }

  async updateDocument(document: any): Promise<void> {
    try {
      await this.db.put(document);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  async deleteDocument(document: any): Promise<void> {
    try {
      await this.db.remove(document);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  private handleChange(change: PouchDB.Core.ChangesResponseChange<any>): void {
    const changedIndex = this.data.findIndex((doc) => doc._id === change.id);

    // a document was deleted
    if (change.deleted && changedIndex !== -1) {
      this.data.splice(changedIndex, 1);
      // a document was updated
    } else if (changedIndex !== -1) {
      this.data[changedIndex] = change.doc;
      // a document was added
    } else {
      this.data.push(change.doc);
    }
  }
}
