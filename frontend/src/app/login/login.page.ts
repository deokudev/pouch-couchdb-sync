import { Component } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PouchDbService } from "../pouchdb.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "login.page.html",
  styleUrls: ["login.page.scss"],
})
export class LoginPage {
  username?: string;
  password?: string;

  constructor(private router: Router, private authService: AuthService, private documentService: PouchDbService) {}

  async login() {
    const res = await this.authService.login({ username: this.username || "", password: this.password || "" });
    this.documentService.init(res);
    this.router.navigateByUrl("/home"); // 새로운 API로 변경
  }

  launchSignup() {
    this.router.navigateByUrl("/signup"); // 새로운 API로 변경
  }
}
