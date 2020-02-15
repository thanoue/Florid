import { Component, OnInit, Input } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer-template.html',
  styleUrls: ['./create-customer-style.css']
})
export class CreateCustomerComponent implements OnInit {

  submitted = false;

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
  }

  newCustomer(): void {
    this.save();
  }

  save() {
    const customer = new Customer();
    customer.FullName = 'tran vinh kha';
    customer.PhoneNumber = '092746253';
    this.customerService.insert(customer).then((res) => {
      console.log('after add', res);
    });
  }
}
