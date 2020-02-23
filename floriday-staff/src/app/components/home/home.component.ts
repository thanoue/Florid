import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {

  constructor(private router: Router) {
    super();
  }
  protected Init() {
  }

  logout() {
    this.setStatusBarColor(true);
    AuthService.logout();
    this.router.navigate(['login']);
  }

  goToPrintJob() {
    this.router.navigate(['printjob']);
  }
}
