import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-orders-manage',
  templateUrl: './orders-manage.component.html',
  styleUrls: ['./orders-manage.component.css']
})
export class OrdersManageComponent extends BaseComponent {

  Title = 'Danh sách đơn';
  NavigateClass = 'prev-icon';

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {
    super(activatedRoute);
  }
  protected OnNavigateClick() {
    this.router.navigate(['']);
  }

  protected Init() {
  }

}
