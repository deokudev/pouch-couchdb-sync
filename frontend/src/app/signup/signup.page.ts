import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { TodosService } from '../todos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;

  constructor(
    private nav: NavController,
    private http: HttpClient,
    private todoService: TodosService
  ) {}

  register() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.http
      .post(environment.apiUrl + '/auth/register', user, { headers })
      .subscribe(
        (res: any) => {
          this.todoService.init(res);
          this.nav.navigateRoot('/home'); // 새로운 API로 변경
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
