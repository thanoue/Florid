import { Injectable } from '@angular/core';
import { LocalService } from './local.service';
import { Roles } from 'src/app/models/enums';
import { Local } from 'protractor/built/driverProviders';
import { LoginModel } from 'src/app/models/user.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  static isLoggedIn(): boolean {
    const user = firebase.auth().currentUser;
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  static logout(signedOutCallback: (isSuccess: boolean) => void) {
    firebase.auth().signOut().then(() => {
      signedOutCallback(true);
    }).catch(error => {

      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode, errorMessage);

      signedOutCallback(false);

    });
  }

  static getCurrentRole(): Roles {

    if (!this.isLoggedIn()) {
      return Roles.None;
    }

    const role = LocalService.getRole();

    return role;
  }

  static login(model: LoginModel, loginCallback: (isSuccess: boolean) => void) {

    firebase.auth().signInWithEmailAndPassword(model.userName, model.passcode)
      .then(userInfo => {
        console.log(userInfo.additionalUserInfo);
        loginCallback(true);
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        loginCallback(false);
      });

  }
}
