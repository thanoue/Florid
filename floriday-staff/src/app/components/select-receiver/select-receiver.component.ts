import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ExchangeService } from 'src/app/services/exchange.service';


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
      selectDeliveryInfo: (data) => this.selectDeliveryInfo(data),
    };

    this.currentList = [];

    this.globalDeliveryInfos.forEach(info => {
      this.currentList.push(info.Info);
    });

    this.deliveryInfo = new OrderDetailDeliveryInfo();

    this.route.params.subscribe(params => {

      this.deliveryInfo = OrderDetailDeliveryInfo.DeepCopy(this.currentGlobalOrderDetail.DeliveryInfo);

      this.deliveryInfo.DateTime.setSeconds(0);

      this.deliveryTime = this.deliveryInfo.DateTime.toLocaleString('vi-VN', { hour12: true });

    });

  }

  selectDeliveryInfo(index: number) {

    this.deliveryInfo = OrderDetailDeliveryInfo.DeepCopy(this.currentList[index]);

    this.deliveryTime = this.deliveryInfo.DateTime.toLocaleString('vi-VN', { hour12: true });
  }

  addReceiver(form: NgForm) {

    if (!form.valid) {
      return;
    }

    let isNew = true;

    this.currentList.forEach(item => {

      if (item.Address.toLowerCase() === this.deliveryInfo.Address.toLowerCase()
        && item.Name.toLowerCase() === this.deliveryInfo.Name.toLowerCase()
        && item.PhoneNumber.toLowerCase() === this.deliveryInfo.PhoneNumber.toLowerCase()
        && ExchangeService.dateCompare(item.DateTime, this.deliveryInfo.DateTime)) {
        isNew = false;
      }

    });

    if (isNew) {
      this.globalDeliveryInfos.push({ CustomerId: '', Info: this.deliveryInfo });
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
