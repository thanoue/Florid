import { Injectable } from '@angular/core';
import { LocalService } from './local.service';
import { Roles } from 'src/app/models/enums';
import { Local } from 'protractor/built/driverProviders';
import { LoginModel } from 'src/app/models/entities/user.entity';
import * as firebase from 'firebase';
import { GlobalService } from './global.service';
import { async } from '@angular/core/testing';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private globalService: GlobalService, private userService: UserService, public auth: AngularFireAuth) { }

  static getCurrentRole(): any {
    const role = LocalService.getRole();
    return role;
  }

  logout(signedOutCallback: (isSuccess: boolean) => void) {

    this.globalService.startLoading();

    this.auth.auth.signOut().then(() => {

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

    this.auth.auth.signInWithEmailAndPassword(model.userName, model.passcode)
      .then(async userInfo => {
        LocalService.setUserId(userInfo.user.uid);

        this.userService.getByLoginId(userInfo.user.uid).then(user => {
          if (user) {
            LocalService.setRole(user.Role);
            LocalService.setUserName(user.FullName);
            LocalService.setPhoneNumber(user.PhoneNumber);

            loginCallback(true);
          } else {
            this.globalService.stopLoading();
            loginCallback(false);
          }
        });
      })
      .catch(error => {
        this.globalService.stopLoading();
        loginCallback(false);
      });
  }
}
