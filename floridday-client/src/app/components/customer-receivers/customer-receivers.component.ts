import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';
import { CustomerReceiverDetail } from 'src/app/models/entities/order.entity';
import { NgForm } from '@angular/forms';
declare function showReceiverSetupPopup(): any;
@Component({
  selector: 'app-customer-receivers',
  templateUrl: './customer-receivers.component.html',
  styleUrls: ['./customer-receivers.component.css']
})
export class CustomerReceiversComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Thông tin nhận hàng', MenuItems.Customer);
  receivers: CustomerReceiverDetail[];
  currentReceiver: CustomerReceiverDetail;

  protected Init() {
    this.receivers = this.globalCustomer.ReceiverInfos ? this.globalCustomer.ReceiverInfos : [];
  }

  constructor() { super(); this.currentReceiver = new CustomerReceiverDetail(); }

  addReceiverShow() {
    showReceiverSetupPopup();
    this.currentReceiver = new CustomerReceiverDetail();
  }

  addReceiver(form: NgForm) {

    if (form.invalid)
      return;

    this.receivers.push(this.currentReceiver);

    this.currentReceiver = new CustomerReceiverDetail();

    this.globalService.hidePopup();
  }

}
