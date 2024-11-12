import { Component } from "@angular/core";
import { PouchDbService } from "../pouchdb.service";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

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

  constructor(private router: Router, private documentService: PouchDbService, private authService: AuthService) {}

  async handleClickRegister() {
    const res = await this.authService.register({
      name: this.name || "",
      username: this.username || "",
      email: this.email || "",
      password: this.password || "",
      confirmPassword: this.confirmPassword || "",
    });
    this.documentService.init(res);
    this.router.navigateByUrl("/home"); // 새로운 API로 변경
  }
}
