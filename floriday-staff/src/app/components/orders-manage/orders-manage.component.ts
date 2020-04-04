import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderViewModel, OrderDetailViewModel } from '../../models/view.models/order.model';
import { OrderDetail } from 'src/app/models/entities/order.entity';
import { OrderDetailStates } from 'src/app/models/enums';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-manage',
  templateUrl: './orders-manage.component.html',
  styleUrls: ['./orders-manage.component.css']
})
export class OrdersManageComponent extends BaseComponent {

  Title = 'Danh sách đơn';
  NavigateClass = 'prev-icon';

  orders: OrderViewModel[];

  states = OrderDetailStates;

  protected IsDataLosingWarning = false;


  constructor(protected activatedRoute: ActivatedRoute, private router: Router, private orderService: OrderService) {
    super();
    this.globalService.currentOrderViewModel = new OrderViewModel();
  }

  protected Init() {

    this.setStatusBarColor(false);

    this.startLoading();

  }
}
