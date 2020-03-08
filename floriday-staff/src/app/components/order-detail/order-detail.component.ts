import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

declare function getInput(resCallback: (res: string) => void): any;
declare function createNumbericElement(): any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent extends BaseComponent {

  Title = 'Chi tiết đơn';

  orderDetail: OrderDetailViewModel;
  detailIndex: number;

  protected Init() {

    this.orderDetail = new OrderDetailViewModel();

    this.route.params.subscribe(params => {
      const index = params.id;
      this.detailIndex = index;
      this.orderDetail = this.globalService.currentOrderViewModel.OrderDetails[index];
    });

    createNumbericElement();

  }

  protected OnNavigateClick() {
    this.globalService.currentOrderViewModel.OrderDetails.pop();
    super.OnNavigateClick();
  }

  constructor(private route: ActivatedRoute) {
    super();

  }

  insertModifiedValue() {
    getInput(res => {
      this.orderDetail.ModifiedPrice = res as unknown as number;
    });
  }

}
