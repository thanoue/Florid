import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
import { LoginModel } from 'src/app/models/entities/user.entity';
import { OnlineUserService } from 'src/app/services/online.user.service';
import { Roles } from 'src/app/models/enums';
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
    LocalService.clear();

  }

  protected Init() {

    this.setStatusBarColor(true);

    this.model.passcode = '123456';
    // this.model.userName = 'florid.florist.main@floridday.com'; // florist
    this.model.userName = 'florid.admin@floridday.com'; //admin
    //   this.model.userName = 'florid.florist.main@floridday.com'; //florist
    // this.model.userName = 'florid.shipper.main@floridday.com'; //shipper

  }

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.authService.login(this.model, isSuccess => {
      if (isSuccess) {

        deviceLogin(this.model.userName, this.model.passcode, LocalService.isPrinter(), LocalService.getAccessToken());

        var role = LocalService.getRole();

        switch (role) {
          case Roles.Admin:
          case Roles.Account:
            this.router.navigate(['/account-main']);
            break;
          case Roles.Florist:
            this.router.navigate(['/florist-main']);
            break;
          case Roles.Shipper:
            this.router.navigate(['/shipper-main']);
            break;
        }


      }
    });

  }
}
