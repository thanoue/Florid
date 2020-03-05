import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
import { LoginModel } from 'src/app/models/entities/user.entity';
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

    this.model.passcode = '221111';
    this.model.userName = 'a.ma33i.van@florid.com';
  }

  login(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.authService.login(this.model, isSuccess => {
      if (isSuccess) {
        this.router.navigate(['']);
      } else {
        this.globalService.showMessageDialog('LỖI ĐĂNG NHẬP', 'Sai tên đăng nhập hoặc mật khẩu!!');
      }
    });

  }
}
