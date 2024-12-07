import { Injectable } from '@angular/core';
import { User } from '../common/User';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  user!:User;
  data!:any;

  constructor() { }

  saveSession(user: User) {
    window.localStorage.removeItem("login");
    window.localStorage.setItem("login", JSON.stringify(user));
  }

  getSession() {
    this.data = localStorage.getItem("login");
    return JSON.parse(this.data);
  }

  deleteSession() {
    window.localStorage.removeItem("login");
  }
}
