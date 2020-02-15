import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/customer';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details-template.html',
  styleUrls: ['./customer-details-style.css']
})
export class CustomerDetailsComponent implements OnInit {

  @Input() user: User;

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
  }

  updateActive(isActive: boolean) {
    this.user.Active = isActive;
    this.userService
      .update(this.user.Id, this.user)
      .catch(err => console.log(err));
  }

  deleteCustomer() {
    this.userService
      .delete(this.user.Id)
      .catch(err => console.log(err));
  }

}
