import { Injectable } from '@angular/core';
import { LocalService } from './local.service';
import { Roles } from 'src/app/models/enums';
import { Local } from 'protractor/built/driverProviders';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  static isLoggedIn() {
    if (LocalService.getLogStatus() != null && LocalService.getLogStatus() === true) {
      return true;
    } else {
      return false;
    }
  }

  static logout() {
    LocalService.setLogStatus(false);
    LocalService.setAccessToken('');
    LocalService.setRole(Roles.None);
  }

  static getCurrentRole(): Roles {

    if (!this.isLoggedIn()) {
      return Roles.None;
    }

    const role = LocalService.getRole();

    return role;
  }


}
