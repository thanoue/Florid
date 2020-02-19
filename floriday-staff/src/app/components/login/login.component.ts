import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router } from '@angular/router';

declare function showErrorDialog(title, content): void;

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

  showToast() {
    showErrorDialog('Loi', 'Dang nhap loi');
  }

  login() {
    LocalService.setLogStatus(true);
    this.router.navigate(['']);

    // if (this.username === 'khoikha' && this.password === 'namidth') {
    //   LocalService.setLogStatus(true);
    //   this.router.navigate(['']);
    // } else {
    //   showErrorDialog('Loi', 'Dang nhap loi');
    // }
  }
}
