import { Injectable } from "@angular/core";
import { LoginRequest, RegisterRequest } from "./auth.model";
import { environment } from "src/environments/environment";
import { CapacitorHttp } from "@capacitor/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor() {}

  async register(data: RegisterRequest) {
    const response = await CapacitorHttp.post({
      url: environment.apiUrl + "/auth/register",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async login(data: LoginRequest) {
    const response = await CapacitorHttp.post({
      url: environment.apiUrl + "/auth/login",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
}
