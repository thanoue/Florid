import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
import { LoginModel } from 'src/app/models/entities/user.entity';
import { OnlineUserService } from 'src/app/services/online.user.service';
declare function deviceLogin(email: string, pasword: string, isPrinter: boolean, idToken: string): any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {

  Title = '';
  NavigateClass = '';

  model: LoginModel = new LoginModel();

  constructor(private router: Router, protected activatedRoute: ActivatedRoute) {
    super();
  }

  protected Init() {

    this.setStatusBarColor(true);

    this.model.passcode = '123456';
    this.model.userName = 'florid.admin@florid.com';
  }

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.authService.login(this.model, isSuccess => {
      if (isSuccess) {

        deviceLogin(this.model.userName, this.model.passcode, LocalService.isPrinter(), LocalService.getAccessToken());

        this.router.navigate(['']);

      } else {

      }

    });

  }
}
