import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ORDER_DETAIL_STATES } from 'src/app/app.constants';
import { OrderDetailStates } from 'src/app/models/enums';

@Component({
  selector: 'app-view-order-detail',
  templateUrl: './view-order-detail.component.html',
  styleUrls: ['./view-order-detail.component.css']
})
export class ViewOrderDetailComponent extends BaseComponent {

  Title = 'Chi tiết đơn';
  IsDataLosingWarning = false;
  orderDetail: OrderDetailViewModel;
  state: string;
  states = OrderDetailStates;

  protected Init() {
    this.orderDetail = this.globalOrderDetail;
    this.state = ORDER_DETAIL_STATES.filter(p => p.State === this.orderDetail.State)[0].DisplayName;
  }

  constructor() {
    super();

  }

}
