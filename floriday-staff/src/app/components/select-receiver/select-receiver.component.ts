import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-receiver',
  templateUrl: './select-receiver.component.html',
  styleUrls: ['./select-receiver.component.css']
})
export class SelectReceiverComponent extends BaseComponent {

  Title: 'Thông tin người nhận';

  currentList: OrderDetailDeliveryInfo[];
  deliveryInfo: OrderDetailDeliveryInfo;

  protected Init() {

    const key = 'angularComponentReference';

    window[key] = {
      component: this, zone: this._ngZone,
      loadAngularFunction: (data) => this.setSelectedCustomer(data)
    };


    this.currentList = [];

    this.deliveryInfo = new OrderDetailDeliveryInfo();

    this.globalService.currentOrderViewModel.OrderDetails.forEach(orderDetail => {
      this.currentList.push(orderDetail.DeliveryInfo);
    });

    this.route.params.subscribe(params => {
      const index = params.id; // --> Name must match wanted parameter
      if (index > -1) {
        this.deliveryInfo = this.globalService.currentOrderViewModel.OrderDetails[index].DeliveryInfo;
      }
    });


  }

  constructor(private route: ActivatedRoute) {
    super();
  }

}
