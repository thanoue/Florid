import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { Router } from '@angular/router';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, Roles } from 'src/app/models/enums';

@Component({
  selector: 'app-order-detail-confirming',
  templateUrl: './order-detail-confirming.component.html',
  styleUrls: ['./order-detail-confirming.component.css']
})
export class OrderDetailConfirmingComponent extends BaseComponent {

  Title = 'Xác nhận thành phẩm';
  protected IsDataLosingWarning = false;
  orderDetail: OrderDetailViewModel;

  protected Init() {
    this.orderDetail = this.globalOrderDetail;

  }

  constructor(private router: Router, private orderDetailService: OrderDetailService) {
    super();
  }

  gotToCusConfirm() {
    this.router.navigate(['/customer-confirming']);
  }

  confirm() {
    switch (this.CurrentUser.Role) {
      case Roles.Account:
      case Roles.Admin:
        this.orderDetailService.getNextShippingSortOrder()
          .then((nextOrder) => {

            let updates = {};
            updates[`/${this.orderDetail.OrderDetailId}/State`] = OrderDetailStates.DeliveryWaiting;
            updates[`/${this.orderDetail.OrderDetailId}/ShippingSortOrder`] = nextOrder;

            this.orderDetailService.updateFields(updates)
              .then(() => {
                super.OnBackNaviage();
              });

          });
        break;
      case Roles.Shipper:

        var updates = {};

        updates[`/${this.orderDetail.OrderDetailId}/State`] = OrderDetailStates.Deliveried;
        updates[`/${this.orderDetail.OrderDetailId}/ShipperInfo/CompletedTime`] = (new Date).getTime();

        this.orderDetailService.updateFields(updates)
          .then(() => {
            super.OnBackNaviage();
          });

      default:
        break;
    }


  }

}
