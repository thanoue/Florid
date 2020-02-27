import { Injectable } from '@angular/core';
import { LocalService } from './local.service';
import { Roles } from 'src/app/models/enums';
import { Local } from 'protractor/built/driverProviders';
import { LoginModel } from 'src/app/models/user.model';
import * as firebase from 'firebase';
import { GlobalService } from './global.service';
import { async } from '@angular/core/testing';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private globalService: GlobalService, private userService: UserService) { }

  static getCurrentRole(): any {
    const role = LocalService.getRole();
    return role;
  }

  logout(signedOutCallback: (isSuccess: boolean) => void) {

    this.globalService.startLoading();

    firebase.auth().signOut().then(() => {

      signedOutCallback(true);
      this.globalService.stopLoading();

    }).catch(error => {

      console.log(error.code, error.message);
      signedOutCallback(false);

      this.globalService.stopLoading();
    });

  }

  login(model: LoginModel, loginCallback: (isSuccess: boolean) => void) {

    this.globalService.startLoading();

    firebase.auth().signInWithEmailAndPassword(model.userName, model.passcode)
      .then(async userInfo => {
        // console.log(userInfo.user.uid);
        LocalService.setUserId(userInfo.user.uid);

        var user = await this.userService.getByLoginId(userInfo.user.uid);

        if (user) {
          LocalService.setRole(user.Role);
          LocalService.setUserName(user.FullName);
          LocalService.setPhoneNumber(user.PhoneNumber);
          loginCallback(true);
        }
      })
      .catch(error => {
        this.globalService.stopLoading();
        loginCallback(false);
      });

  }
}
