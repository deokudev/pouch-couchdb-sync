import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TodosService } from './todos.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent], // Page 추가
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, // Http 요청을 위함
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    TodosService,
  ], // Service 추가
  bootstrap: [AppComponent],
})
export class AppModule {}
