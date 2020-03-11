import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { NgForm } from '@angular/forms';
import { CustomerViewModel } from '../../models/view.models/customer.model';
import { Customer } from 'src/app/models/entities/customer.entity';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderCustomerInfoViewModel } from 'src/app/models/view.models/order.model';
import { MembershipTypes } from 'src/app/models/enums';

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

  constructor(private customerService: CustomerService, private _ngZone: NgZone) {
    super();

    const key = 'customerReference';

    window[key] = {
      component: this, zone: this._ngZone,
      setSelectedCustomer: (data) => this.setSelectedCustomer(data)
    };

  }

  setSelectedCustomer(id: string) {
    this.selectedCustomer = this.customers.filter(p => p.Id === id)[0];
  }

  protected afterViewLoad() {

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
    customer.MembershipInfo.MembershipType = MembershipTypes.NewCustomer;

    this.customerService.insert(customer).then(res => {

      this.newCustomer = new CustomerViewModel();

      this.getCustomerList();

      this.selectedCustomer = customer;

      this.currentGlobalOrder.CustomerInfo = OrderCustomerInfoViewModel.toViewModel(this.selectedCustomer);

      closeAddCustomerDialog();

    });

  }

  selectConfirm() {

    if (this.selectedCustomer == null) {
      this.globalService.showMessageDialog('Lỗi!', 'Chưa chọn khách hàng nào cả!!!');
      return;
    }

    this.currentGlobalOrder.CustomerInfo = OrderCustomerInfoViewModel.toViewModel(this.selectedCustomer);

    this.OnNavigateClick();

  }

  getCustomerList() {
    this.customerService.getAll().then(customers => {
      this.customers = customers;
      setTimeout(() => {
        if (this.currentGlobalOrder.CustomerInfo.Id) {
          setSelectedCustomerItem(this.currentGlobalOrder.CustomerInfo.Id);
          this.selectedCustomer = customers.find(p => p.Id === this.currentGlobalOrder.CustomerInfo.Id);
        }
      }, 50);
    });
  }


}
