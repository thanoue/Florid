import { Injectable } from '@angular/core';
import { LocalService } from './local.service';
import { Roles } from 'src/app/models/enums';
import { Local } from 'protractor/built/driverProviders';
import { LoginModel } from 'src/app/models/entities/user.entity';
import * as firebase from 'firebase';
import { GlobalService } from './global.service';
import { UserService } from '../user.service';
import { HttpService } from './http.service';
import { OnlineUserService } from '../online.user.service';
import { OnlineUser } from 'src/app/models/entities/online.user.entity';
import { FunctionsService } from './functions.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private onlineUserService: OnlineUserService, private globalService: GlobalService, private userService: UserService, private httpService: HttpService) {
  }

  static getCurrentRole(): any {
    const role = LocalService.getRole();
    return role;
  }

  loutOutFirebase(signedOutCallback: (isSuccess: boolean) => void) {

    this.globalService.startLoading();

    firebase.auth().signOut().then(() => {

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
    firebase.auth().signInWithEmailAndPassword(model.userName, model.passcode)
      .then(async userInfo => {

        LocalService.clear();

        try {

          const res = await FunctionsService.excuteFunction('getUserInfo');

          if (!res) {

            this.globalService.stopLoading();
            loginCallback(false);

          } else {

            firebase.auth().currentUser.getIdToken(true).then(idToken => {
              LocalService.setUserName(userInfo.user.displayName);
              LocalService.setAccessToken(idToken);
              LocalService.setPhoneNumber(userInfo.user.phoneNumber);
              LocalService.setRole(res.role);
              LocalService.setUserAvtUrl(userInfo.user.photoURL);
              LocalService.setUserEmail(userInfo.user.email);
              LocalService.setUserId(userInfo.user.uid);
              LocalService.setIsPrinter(!res.isPrinter ? false : res.isPrinter);

              const onlineUser = new OnlineUser();
              onlineUser.Id = userInfo.user.uid;

              this.onlineUserService.set(onlineUser).then(() => {
                this.globalService.stopLoading();
                loginCallback(true);
              });

            }).catch(error => {
              throw new Error(error);
            });
          }
        } catch (error) {
          this.globalService.showError(error);
          this.globalService.stopLoading();
          loginCallback(false);
        }

      })
      .catch(error => {

        this.globalService.showError(error);
        this.globalService.stopLoading();
        loginCallback(false);

      });
  }
}
