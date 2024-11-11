import { Injectable } from "@angular/core";
import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TodosService {
  data: any;
  db: any;
  remote: any;

  constructor() {}

  init(details: any) {
    PouchDB.plugin(PouchDBFind); // PouchDB Find 플러그인 등록
    this.db = new PouchDB("cloudo");

    this.remote = details.userDBs.supertest.replace(/127.0.0.1:5984/, environment.couchUrl.replace(/^https?:\/\//, ""));

    let options = {
      live: true,
      retry: true,
      continuous: true,
    };

    this.db.sync(this.remote, options);

    console.log(this.db);
  }

  logout() {
    this.data = null;

    this.db.destroy().then(() => {
      console.log("database removed");
    });
  }

  getTodos() {
    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise((resolve) => {
      this.db
        .allDocs({
          include_docs: true,
        })
        .then((result: any) => {
          this.data = [];

          let docs = result.rows.map((row: any) => {
            this.data.push(row.doc);
          });

          resolve(this.data);

          this.db.changes({ live: true, since: "now", include_docs: true }).on("change", (change: any) => {
            this.handleChange(change);
          });
        })
        .catch((error: any) => {
          console.log(error);
        });
    });
  }

  createTodo(todo: any) {
    this.db.post(todo);
  }

  updateTodo(todo: any) {
    this.db.put(todo).catch((err: any) => {
      console.log(err);
    });
  }

  deleteTodo(todo: any) {
    this.db.remove(todo).catch((err: any) => {
      console.log(err);
    });
  }

  handleChange(change: any) {
    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc: any, index: any) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    //A document was deleted
    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    } else {
      //A document was updated
      if (changedDoc) {
        if (changedIndex != null) {
          this.data[changedIndex] = change.doc;
        }
      }

      //A document was added
      else {
        this.data.push(change.doc);
      }
    }
  }

  replaceHost(url: string, newHost: string): string {
    // 정규식으로 호스트 부분 매칭
    return url.replace(/(https?:\/\/[^@]+@)[^/]+/, `$1${newHost}`);
  }
}
