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
import { OnlineUserService } from '../online.user.service';
import { OnlineUser } from 'src/app/models/entities/online.user.entity';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private onlineUserService: OnlineUserService, private globalService: GlobalService, private userService: UserService, public auth: AngularFireAuth, private httpService: HttpService) { }

  static getCurrentRole(): any {
    const role = LocalService.getRole();
    return role;
  }

  logout(signedOutCallback: (isSuccess: boolean) => void) {

    this.globalService.startLoading();

    this.httpService.post(API_END_POINT.logout).subscribe(res => {

      this.auth.auth.signOut().then(() => {

        LocalService.clear();
        this.globalService.stopLoading();
        signedOutCallback(true);

      }).catch(error => {

        console.log(error.code, error.message);
        signedOutCallback(false);

        this.globalService.stopLoading();
      });

    });

  }

  // updateOnlineToken(userId: string, loginCallback: (isSuccess: boolean) => void) {

  //   console.log(userId);
  //   const messaging = firebase.messaging();
  //   // messaging.usePublicVapidKey('BIZOhihjfLupj-da-4q_GPRBp9f39iPan8tp2yubv677JeQqShRoeSQtEXQY-52asVtHdrM6m4Nh3umQswuGh4U');

  //   messaging.getToken().then((currentToken) => {
  //     if (currentToken) {
  //       console.log('current token: ', currentToken);
  //       this.messageReceivingRegister(messaging, userId, currentToken, loginCallback);
  //     } else {
  //       // Show permission request.
  //       console.log('No Instance ID token available. Request permission to generate one.');
  //       // Show permission UI.
  //     }
  //   }).catch((err) => {
  //     console.log('An error occurred while retrieving token. ', err);
  //   });

  //   messaging.onTokenRefresh(() => {
  //     messaging.getToken().then((currentToken) => {
  //       if (currentToken) {
  //         this.messageReceivingRegister(messaging, userId, currentToken, null);
  //       } else {
  //         // Show permission request.
  //         console.log('No Instance ID token available. Request permission to generate one.');
  //         // Show permission UI.
  //       }
  //     }).catch((err) => {
  //       console.log('An error occurred while retrieving token. ', err);
  //     });
  //   });
  // }

  // messageReceivingRegister(messaging: firebase.messaging.Messaging, userId: string, token: string, loginCallback: (isSuccess: boolean) => void) {

  //   this.globalService.startLoading();

  //   const onlineUser = new OnlineUser();
  //   onlineUser.Id = userId;
  //   onlineUser.ClientToken = token;

  //   this.onlineUserService.set(onlineUser).then(res => {

  //     messaging.onMessage(payload => {
  //       console.log(payload);
  //     });

  //     if (loginCallback !== null) { loginCallback(true); }

  //     this.globalService.stopLoading();

  //   });

  // }

  login(model: LoginModel, loginCallback: (isSuccess: boolean) => void) {

    this.globalService.startLoading();

    this.httpService.post(API_END_POINT.login, {
      username: model.userName,
      password: model.passcode
    }, false).subscribe(res => {
      console.log('loggin called');
      if (res) {

        this.auth.auth.signInWithEmailAndPassword(model.userName, model.passcode)
          .then(async userInfo => {

            LocalService.clear();

            this.globalService.stopLoading();

            LocalService.setAccessToken(res.token);
            LocalService.setUserName(res.FullName);
            LocalService.setPhoneNumber(res.PhoneNumber);
            LocalService.setRole(res.Role);
            LocalService.setUserEmail(res.Email);
            LocalService.setUserId(userInfo.user.uid);
            LocalService.setIsPrinter(!res.IsPrinter ? false : res.IsPrinter);

            

            loginCallback(true);

          })
          .catch(error => {

            this.globalService.stopLoading();
            loginCallback(false);

          });
      } else {

        this.globalService.stopLoading();
        loginCallback(false);

      }
    });


  }
}
