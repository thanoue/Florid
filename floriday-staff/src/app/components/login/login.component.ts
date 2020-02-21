import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {

  username = 'khoikha';
  password = 'namidth';

  constructor(private router: Router) {
    super();
  }

  protected Init() {
  }

  login() {
    this.setStatusBarColor(false);
    LocalService.setLogStatus(true);
    this.router.navigate(['']);
  }
}
