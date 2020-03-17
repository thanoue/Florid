import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';


declare function getDateTimeSelecting(year: number, month: number, day: number, hour: number, minute: number): any;
declare function getTimeSelecting(hour: number, minute: number): any;

@Component({
  selector: 'app-select-receiver',
  templateUrl: './select-receiver.component.html',
  styleUrls: ['./select-receiver.component.css']
})
export class SelectReceiverComponent extends BaseComponent {

  Title = 'Thông tin người nhận';

  currentList: OrderDetailDeliveryInfo[];
  deliveryInfo: OrderDetailDeliveryInfo;
  deliveryTime = '';

  protected IsDataLosingWarning = false;

  constructor(private route: ActivatedRoute, private _ngZone: NgZone) {
    super();
  }

  protected Init() {

    const key = 'DeliveryInfoReference';

    window[key] = {
      component: this,
      zone: this._ngZone,
      selectDeliveryInfo: (data) => this.selectReceiver(data),
    };


    this.currentList = [];

    this.deliveryInfo = new OrderDetailDeliveryInfo();

    this.currentGlobalOrder.OrderDetails.forEach(orderDetail => {

      const temp = OrderDetailDeliveryInfo.DeepCopy(orderDetail.DeliveryInfo);

      this.currentList.push(temp);

    });

    this.route.params.subscribe(params => {

      this.deliveryInfo = OrderDetailDeliveryInfo.DeepCopy(this.currentGlobalOrderDetail.DeliveryInfo);

      this.deliveryInfo.DateTime.setSeconds(0);

      this.deliveryTime = this.deliveryInfo.DateTime.toLocaleString('vi-VN', { hour12: true });

    });

  }

  selectReceiver(index: number) {

    this.deliveryInfo = OrderDetailDeliveryInfo.DeepCopy(this.currentList[index]);

    this.deliveryTime = this.deliveryInfo.DateTime.toLocaleString('vi-VN', { hour12: true });

  }

  addReceiver(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.currentGlobalOrderDetail.DeliveryInfo = OrderDetailDeliveryInfo.DeepCopy(this.deliveryInfo);

    super.OnBackNaviage();
  }

  requestDateTimePicker() {
    // tslint:disable-next-line:max-line-length
    getDateTimeSelecting(this.deliveryInfo.DateTime.getFullYear(), this.deliveryInfo.DateTime.getMonth(), this.deliveryInfo.DateTime.getDate(), this.deliveryInfo.DateTime.getHours(), this.deliveryInfo.DateTime.getMinutes());
  }

  protected dateTimeSelected(year: number, month: number, day: number, hour: number, minute: number) {

    this.deliveryInfo.DateTime.setFullYear(year);
    this.deliveryInfo.DateTime.setMonth(month);
    this.deliveryInfo.DateTime.setDate(day);
    this.deliveryInfo.DateTime.setHours(hour);
    this.deliveryInfo.DateTime.setMinutes(minute);

    this.deliveryTime = this.deliveryInfo.DateTime.toLocaleString('vi-VN', { hour12: true });

  }

}
