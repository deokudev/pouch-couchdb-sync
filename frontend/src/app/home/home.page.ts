import { Component } from "@angular/core";
import { PouchDbService } from "../pouchdb.service";
import { AlertController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  documents: any;

  constructor(private router: Router, private documentService: PouchDbService, private alertCtrl: AlertController) {}

  async ionViewDidEnter() {
    this.documents = await this.documentService.getDocuments();
  }

  logout() {
    this.documentService.logout();
    this.documents = null;
    this.router.navigateByUrl("/login"); // 새로운 API로 변경
  }

  async createDocument() {
    const alert = await this.alertCtrl.create({
      header: "Add",
      message: "What do you need to do?",
      inputs: [
        {
          name: "title",
          placeholder: "Document Title", // 추가된 플레이스홀더
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Save",
          handler: (data) => {
            if (data.title) {
              this.documentService.createDocument({ title: data.title });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async updateDocument(document: any) {
    const alert = await this.alertCtrl.create({
      header: "Edit",
      message: "Change your mind?",
      inputs: [
        {
          name: "title",
          value: document.title, // 기존 제목으로 초기값 설정
          placeholder: "Document Title", // 추가된 플레이스홀더
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Save",
          handler: (data) => {
            if (data.title) {
              this.documentService.updateDocument({
                _id: document._id,
                _rev: document._rev,
                title: data.title,
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  deleteDocument(document: any) {
    this.documentService.deleteDocument(document);
  }
}
