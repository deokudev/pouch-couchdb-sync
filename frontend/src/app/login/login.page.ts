import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PouchDbService } from "../pouchdb.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "login.page.html",
  styleUrls: ["login.page.scss"],
})
export class LoginPage {
  username?: string;
  password?: string;

  constructor(
    private router: Router,
    private http: HttpClient, // HttpClient 사용
    private documentService: PouchDbService
  ) {}

  async login() {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    const credentials = {
      username: this.username,
      password: this.password,
    };

    try {
      const res = await this.http.post<any>(environment.apiUrl + "/auth/login", credentials, { headers }).toPromise(); // Observable을 Promise로 변환

      console.log(res);
      this.documentService.init(res);
      this.router.navigateByUrl("/home"); // 새로운 API로 변경
    } catch (err) {
      console.error(err);
    }
  }

  launchSignup() {
    this.router.navigateByUrl("/signup"); // 새로운 API로 변경
  }
}
