import { Component } from '@angular/core';
import { TodosService } from '../todos.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todos: any;

  constructor(
    private nav: NavController,
    private todoService: TodosService,
    private alertCtrl: AlertController
  ) {}

  async ionViewDidEnter() {
    this.todos = await this.todoService.getTodos();
  }

  logout() {
    this.todoService.logout();
    this.todos = null;
    this.nav.navigateRoot('/login'); // 새로운 API로 변경
  }

  async createTodo() {
    const alert = await this.alertCtrl.create({
      header: 'Add',
      message: 'What do you need to do?',
      inputs: [
        {
          name: 'title',
          placeholder: 'Todo Title', // 추가된 플레이스홀더
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
            if (data.title) {
              this.todoService.createTodo({ title: data.title });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async updateTodo(todo: any) {
    const alert = await this.alertCtrl.create({
      header: 'Edit',
      message: 'Change your mind?',
      inputs: [
        {
          name: 'title',
          value: todo.title, // 기존 제목으로 초기값 설정
          placeholder: 'Todo Title', // 추가된 플레이스홀더
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
            if (data.title) {
              this.todoService.updateTodo({
                _id: todo._id,
                _rev: todo._rev,
                title: data.title,
              });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  deleteTodo(todo: any) {
    this.todoService.deleteTodo(todo);
  }
}
