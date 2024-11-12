import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NavController } from "@ionic/angular";
import { PouchDbService } from "../pouchdb.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-signup",
  templateUrl: "signup.page.html",
  styleUrls: ["signup.page.scss"],
})
export class SignupPage {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;

  constructor(private router: Router, private http: HttpClient, private documentService: PouchDbService) {}

  register() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });

    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.http.post(environment.apiUrl + "/auth/register", user, { headers }).subscribe(
      (res: any) => {
        this.documentService.init(res);
        this.router.navigateByUrl("/home"); // 새로운 API로 변경
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
