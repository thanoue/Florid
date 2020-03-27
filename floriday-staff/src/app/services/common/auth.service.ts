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
import { HttpService } from './http.service';
import { API_END_POINT } from 'src/app/app.constants';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private globalService: GlobalService, private userService: UserService, public auth: AngularFireAuth, private httpService: HttpService) { }

  static getCurrentRole(): any {
    const role = LocalService.getRole();
    return role;
  }

  logout(signedOutCallback: (isSuccess: boolean) => void) {

    this.globalService.startLoading();

    this.auth.auth.signOut().then(() => {

      LocalService.clear();
      this.globalService.stopLoading();
      signedOutCallback(true);

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

        const loggedUserId = LocalService.getUserId();

        if (loggedUserId === userInfo.user.uid) {

          this.globalService.stopLoading();
          loginCallback(true);

          return;
        }

        this.httpService.post(API_END_POINT.login, {
          username: model.userName,
          password: model.passcode
        }, false).subscribe(res => {
          if (res) {

            this.globalService.stopLoading();

            LocalService.setAccessToken(res.token);
            LocalService.setUserName(res.FullName);
            LocalService.setPhoneNumber(res.PhoneNumber);
            LocalService.setRole(res.Role);
            LocalService.setUserEmail(res.Email);
            LocalService.setUserId(userInfo.user.uid);

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
