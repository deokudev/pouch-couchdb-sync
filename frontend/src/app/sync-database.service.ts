import { Injectable } from "@angular/core";
import { Capacitor } from "@capacitor/core";
// import { SQLiteConnection } from "@capacitor-community/sqlite";
import PouchDB from "pouchdb";
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: "root",
})
export class SyncDatabaseService {
  private sqlite: any;
  private pouchdb!: PouchDB.Database;
  private remoteCouch: string = "http://example.com/dbname";
  private currentSchemaVersion: number = 1;

  constructor() {
    // this.initSyncDatabases();
  }

  public async initSyncDatabases() {
    // sqlite : local database (이미 초기화되었다고 가정)
    // pouchdb : local repository (indexeddb)
    // couchdb : remote repository
    this.initLocalRepositoryDB();
    this.initSyncWithRemoteDB();
  }

  private initLocalRepositoryDB() {
    this.pouchdb = new PouchDB("appdb");
  }

  private initSyncWithRemoteDB() {
    this.pouchdb
      .sync(this.remoteCouch, {
        live: true,
        retry: true,
        since: "now",
      })
      .on("change", (change) => {
        console.log("Sync change", change);
        // couchdb(remote)/pouchdb(local) -> sqlite
        this.upsertSQLiteFromPouchDB(change);
      })
      .on("error", (err) => {
        console.error("Sync error", err);
      });
  }

  async createDocument(tableName: string, document: any): Promise<void> {
    // local database(sqlite)에 추가되었다고 가정 (같은 Transaction 상에서 수행 필요)
    const createdDocument = {
      ...document,
      schema_version: this.currentSchemaVersion,
      table_name: tableName,
    };
    await this.pouchdb.post(createdDocument);
  }

  async updateDocument(
    tableName: string,
    id: string,
    document: any
  ): Promise<void> {
    // local database(sqlite)에 수정되었다고 가정 (같은 Transaction 상에서 수행 필요)
    const updatedDocument = {
      ...document,
      schema_version: this.currentSchemaVersion,
      table_name: tableName,
    };
    await this.pouchdb.put(document);
  }

  async deleteDocument(tableName: string, document: any): Promise<void> {
    try {
      await this.pouchdb.remove(document);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  async upsertDocument(tableName: string, doc: any) {
    const now = new Date();
    const updatedDoc = {
      ...doc,
      _id: doc._id || uuidv4(),
      updated_datetime: now,
      created_datetime: doc.created_datetime || now,
      schema_version: this.currentSchemaVersion,
      table_name: tableName,
    };

    // PouchDB에 저장
    try {
      const existingDoc = await this.pouchdb.get(updatedDoc._id);
      updatedDoc._rev = existingDoc._rev;
    } catch (err) {
      // 문서가 존재하지 않는 경우 (새 문서)
    }
    await this.pouchdb.put(updatedDoc);

    return updatedDoc;
  }

  private async upsertToSQLite(doc: any) {
    const tableName = doc.table_name;
    const columns = Object.keys(doc).filter(
      (key) => !key.startsWith("_") && key !== "table_name"
    );
    const placeholders = columns.map(() => "?").join(", ");
    const values = columns.map((col) => doc[col]);

    const sqlStatement = `
      INSERT OR REPLACE INTO ${tableName} 
      (${columns.join(", ")}) 
      VALUES (${placeholders})
    `;

    await this.sqlite.run({
      statement: sqlStatement,
      values: values,
    });
  }

  // async deleteDocument(tableName: string, docId: string) {
  //   const doc = await this.getDocument(tableName, docId);
  //   if (doc) {
  //     doc._deleted = true;
  //     await this.upsertDocument(doc);
  //   }
  // }

  async getDocument(docId: string) {
    if (this.sqlite) {
      // 모든 테이블에서 검색
      const tables = await this.getTables();
      for (const table of tables) {
        const result = await this.sqlite.query({
          statement: `SELECT * FROM ${table} WHERE _id = ?`,
          values: [docId],
        });
        if (result.values.length > 0) {
          return result.values[0];
        }
      }
      return null;
    } else {
      return await this.pouchdb.get(docId);
    }
  }

  private async upsertSQLiteFromPouchDB(change: any) {
    if (!this.sqlite) return;

    let doc = change.doc;
    // 스키마 버전 확인 및 필요 시 마이그레이션
    if (doc.schema_version < this.currentSchemaVersion) {
      doc = await this.migrateSchema(doc);
    }

    if (doc._deleted) {
      // SQLite에서 해당 문서 삭제
      await this.sqlite.run({
        statement: `DELETE FROM ${doc.table_name} WHERE _id = ?`,
        values: [doc._id],
      });
    } else {
      // 문서 업데이트 또는 삽입
      await this.upsertToSQLite(doc);
    }
  }

  private async migrateSchema(doc: any): Promise<any> {
    // 여기에 스키마 마이그레이션 로직을 구현합니다.
    // 예: if (doc.schema_version === 1) { ... } 등

    doc.schema_version = this.currentSchemaVersion;
    return doc;
  }

  private async getTables(): Promise<string[]> {
    const result = await this.sqlite.query({
      statement: "SELECT name FROM sqlite_master WHERE type='table'",
    });
    return result.values.map((row: any) => row.name);
  }
}
