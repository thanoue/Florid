import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

declare function getDateSelecting(year: number, month: number, day: number): any;
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
  currDeliveryDate = '';
  currDeliveryTime = '';
  orderDetailIndex = -1;

  protected Init() {

    const key = 'angularComponentReference';
    window[key] = {
      component: this,
      zone: this._ngZone,
      selectDeliveryInfo: (data) => this.selectReceiver(data),
      dateSelected: (year: number, month: number, day: number) => this.dateSelecting(year, month, day),
      timeSelected: (hour: number, minute: number) => this.timeSelecting(hour, minute)
    };


    this.currentList = [];

    this.deliveryInfo = new OrderDetailDeliveryInfo();

    this.globalService.currentOrderViewModel.OrderDetails.forEach(orderDetail => {
      const temp = new OrderDetailDeliveryInfo();
      Object.assign(temp, orderDetail.DeliveryInfo);
      this.currentList.push(temp);
    });

    this.route.params.subscribe(params => {
      const index = params.id;
      this.orderDetailIndex = index;
      this.deliveryInfo = Object.assign(this.deliveryInfo, this.globalService.currentOrderViewModel.OrderDetails[this.orderDetailIndex].DeliveryInfo);

      this.currDeliveryDate = this.deliveryInfo.DateTime.toLocaleDateString();
      this.currDeliveryTime = this.deliveryInfo.DateTime.toLocaleTimeString('vi-VN', { hour12: true });

      this.deliveryInfo.DateTime.setSeconds(0);

    });

  }



  selectReceiver(index: number) {
    Object.assign(this.deliveryInfo, this.currentList[index]);
    this.currDeliveryDate = this.deliveryInfo.DateTime.toLocaleDateString();
    this.currDeliveryTime = this.deliveryInfo.DateTime.toLocaleTimeString('vi-VN', { hour12: true });
  }

  addReceiver(form: NgForm) {
    if (!form.valid) {
      return;
    }
    Object.assign(this.globalService.currentOrderViewModel.OrderDetails[this.orderDetailIndex].DeliveryInfo, this.deliveryInfo);
    super.OnNavigateClick();
  }

  requestTimepicker() {
    getTimeSelecting(this.deliveryInfo.DateTime.getHours(), this.deliveryInfo.DateTime.getMinutes());
  }

  timeSelecting(hour: number, minute: number) {

    this.deliveryInfo.DateTime.setHours(hour);
    this.deliveryInfo.DateTime.setMinutes(minute);

    this.currDeliveryTime = this.deliveryInfo.DateTime.toLocaleTimeString('vi-VN', { hour12: true });

  }

  requestDatepicker() {
    getDateSelecting(this.deliveryInfo.DateTime.getFullYear(), this.deliveryInfo.DateTime.getMonth(), this.deliveryInfo.DateTime.getDate());
  }

  dateSelecting(year: number, month: number, day: number) {

    this.deliveryInfo.DateTime.setFullYear(year);
    this.deliveryInfo.DateTime.setMonth(month);
    this.deliveryInfo.DateTime.setDate(day);

    this.currDeliveryDate = this.deliveryInfo.DateTime.toLocaleDateString();

  }

  constructor(private route: ActivatedRoute, private _ngZone: NgZone) {
    super();
  }

}
