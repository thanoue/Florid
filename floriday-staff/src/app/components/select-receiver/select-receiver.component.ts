import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-select-receiver',
  templateUrl: './select-receiver.component.html',
  styleUrls: ['./select-receiver.component.css']
})
export class SelectReceiverComponent extends BaseComponent {

  Title: 'Thông tin người nhận';

  currentList: OrderDetailDeliveryInfo[];
  deliveryInfo: OrderDetailDeliveryInfo;
  orderDetailIndex = -1;

  protected Init() {

    const key = 'angularComponentReference';

    window[key] = {
      component: this, zone: this._ngZone,
      loadAngularFunction: (data) => this.selectReceiver(data)
    };


    this.currentList = [];

    this.deliveryInfo = new OrderDetailDeliveryInfo();

    this.globalService.currentOrderViewModel.OrderDetails.forEach(orderDetail => {
      this.currentList.push(orderDetail.DeliveryInfo);
    });

    this.route.params.subscribe(params => {
      const index = params.id;
      this.orderDetailIndex = index;
      this.deliveryInfo = Object.assign(this.deliveryInfo, this.globalService.currentOrderViewModel.OrderDetails[index].DeliveryInfo);
    });

  }

  selectReceiver(index: number) {
    console.log(index);
    Object.assign(this.deliveryInfo, this.currentList[index]);
  }

  addReceiver(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.globalService.currentOrderViewModel.OrderDetails[this.orderDetailIndex].DeliveryInfo = this.deliveryInfo;
    super.OnNavigateClick();
  }

  constructor(private route: ActivatedRoute, private _ngZone: NgZone) {
    super();
  }

}
