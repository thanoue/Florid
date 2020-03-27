import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

declare function customerSupport(): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {

  Title = 'Trang chủ';
  NavigateClass = 'nav-icon';
  IsDataLosingWarning = false;

  protected OnBackNaviage() {
    customerSupport();
  }

  constructor(private router: Router, protected activatedRoute: ActivatedRoute) {
    super();
  }

  protected Init() {
    this.setStatusBarColor(false);
  }

  logout() {

    this.authService.logout(isSuccess => {
      if (isSuccess) {
        this.router.navigate(['login']);
      }
    });
  }

  goToPrintJob() {
    this.router.navigate(['printjob']);
  }



}
