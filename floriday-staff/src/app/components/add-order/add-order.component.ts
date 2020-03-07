import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates } from 'src/app/models/enums';
import { GlobalService } from 'src/app/services/common/global.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent extends BaseComponent {

  Title = 'Thêm Đơn';

  order: OrderViewModel;

  protected Init() {

    this.order = this.globalService.currentOrderViewModel;
  }


  constructor() {
    super();
  }

}
