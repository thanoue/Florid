import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionsService } from 'src/app/services/common/functions.service';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {

  protected PageCompnent = new PageComponent('Trang chủ', MenuItems.Home);

  constructor(private router: Router, protected activatedRoute: ActivatedRoute) {
    super();
  }

  protected Init() {
  }

  logout() {

    this.authService.loutOutFirebase(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['login']);
      }

    });
  }

  goToPrintJob() {
  }

  async getUsers() {
    try {
      this.startLoading();
      const users = await FunctionsService.excuteFunction('getUsers');
      console.log(users);
      this.stopLoading();
    } catch (error) {
      this.showWarning(error);
    }
  }
}
