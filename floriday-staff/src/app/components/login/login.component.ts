import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { LoginModel } from 'src/app/models/user.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {

  model: LoginModel = new LoginModel();

  constructor(private router: Router) {
    super();
  }

  protected Init() {
    this.setStatusBarColor(true);
    this.model.passcode = '123645';
    this.model.userName = 'ba.mai@florid.com';
  }

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.authService.login(this.model, isSuccess => {
      if (isSuccess) {
        this.router.navigate(['']);
      }
    });
  }
}
