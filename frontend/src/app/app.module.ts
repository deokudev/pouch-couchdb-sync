import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { PouchDbService } from "./pouchdb.service";
import { HttpClientModule } from "@angular/common/http";
import { AuthModule } from "./auth/auth.module";

@NgModule({
  declarations: [AppComponent], // Page 추가
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, // Http 요청을 위함
    AuthModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, PouchDbService], // Service 추가
  bootstrap: [AppComponent],
})
export class AppModule {}
