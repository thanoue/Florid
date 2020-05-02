import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { NgForm } from '@angular/forms';
import { CustomerViewModel } from '../../models/view.models/customer.model';
import { Customer } from 'src/app/models/entities/customer.entity';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderCustomerInfoViewModel, OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { MembershipTypes } from 'src/app/models/enums';
import { FunctionsService } from 'src/app/services/common/functions.service';

declare function closeAddCustomerDialog(): any;
declare function setSelectedCustomerItem(id: string): any;

@Component({
  selector: 'app-select-customer',
  templateUrl: './select-customer.component.html',
  styleUrls: ['./select-customer.component.css']
})
export class SelectCustomerComponent extends BaseComponent {

  Title = 'Chọn khách hàng';
  newCustomer: CustomerViewModel;
  customers: Customer[];
  selectedCustomer: Customer;
  protected IsDataLosingWarning = false;

  constructor(private customerService: CustomerService, private _ngZone: NgZone) {
    super();

    const key = 'selectItemReference';

    window[key] = {
      component: this, zone: this._ngZone,
      itemSelected: (data) => this.setSelectedCustomer(data)
    };

  }

  setSelectedCustomer(id: string) {
    this.selectedCustomer = this.customers.filter(p => p.Id === id)[0];
  }

  protected Init() {
    this.newCustomer = new CustomerViewModel();
    this.getCustomerList();
    this.selectedCustomer = null;
  }

  addCustomer(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.selectedCustomer = null;

    const customer = new Customer();

    customer.FullName = this.newCustomer.Name;
    customer.PhoneNumber = this.newCustomer.PhoneNumber;
    customer.MembershipInfo.MembershipType = MembershipTypes.VVipMember;
    customer.MembershipInfo.AccumulatedAmount = 99999999;
    customer.MembershipInfo.AvailableScore = 30000;
    customer.MembershipInfo.UsedScoreTotal = 5000;

    this.customerService.insert(customer).then(res => {

      this.newCustomer = new CustomerViewModel();

      this.getCustomerList();

      this.selectedCustomer = customer;

      this.globalOrder.CustomerInfo = OrderCustomerInfoViewModel.toViewModel(this.selectedCustomer);

      closeAddCustomerDialog();

    });

  }

  selectConfirm() {

    if (this.selectedCustomer == null) {
      this.showError('Chưa chọn khách hàng nào cả!!!');
      return;
    }

    if (this.globalOrder.CustomerInfo.Id === this.selectedCustomer.Id) {
      this.OnBackNaviage();
    }

    this.globalOrder.CustomerInfo = OrderCustomerInfoViewModel.toViewModel(this.selectedCustomer);

    this.OnBackNaviage();

  }

  getCustomerList() {

    try {
      FunctionsService.excuteFunction('searchCustomer', '0988712')
        .then((customers) => {
          console.log(customers);
          this.customers = customers;
          setTimeout(() => {
            if (this.globalOrder.CustomerInfo.Id) {
              setSelectedCustomerItem(this.globalOrder.CustomerInfo.Id);
              this.selectedCustomer = customers.find(p => p.Id === this.globalOrder.CustomerInfo.Id);
            }
          }, 50);
        });
    } catch (error) {
      this.showError(error);
      return;
    }

    // this.customerService.getAll().then(customers => {
    //   this.customers = customers;
    //   setTimeout(() => {
    //     if (this.globalOrder.CustomerInfo.Id) {
    //       setSelectedCustomerItem(this.globalOrder.CustomerInfo.Id);
    //       this.selectedCustomer = customers.find(p => p.Id === this.globalOrder.CustomerInfo.Id);
    //     }
    //   }, 50);
    // });
  }



}
