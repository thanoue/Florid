import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/common/auth.service';
import { LoginModel } from 'src/app/models/entities/user.entity';
import { OnlineUserService } from 'src/app/services/online.user.service';
import { ProductService } from 'src/app/services/product.service';
import { strict } from 'assert';
import { DistrictAddressService } from 'src/app/services/address/district-address.service';
import { WardAddressService } from 'src/app/services/address/ward-address.service';
import { CustomerService } from 'src/app/services/customer.service';
declare function deviceLogin(email: string, pasword: string, isPrinter: boolean, idToken: string): any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {

  Title = '';
  NavigateClass = '';

  model: LoginModel = new LoginModel();

  constructor(private router: Router, private customerService: CustomerService, protected activatedRoute: ActivatedRoute,
    private productService: ProductService,) {
    super();
  }

  protected Init() {

    this.setStatusBarColor(true);

    this.model.passcode = '123456';
    this.model.userName = 'florid.admin@florid.com';
  }

  login(form: NgForm) {
    this.loadCustomers();
    //this.loadWards();
  }

  loadCustomers() {
    this.customerService.getAll()
      .then(customers => {
        console.log(JSON.stringify(customers));
      })
  }

  loadDistrict() {
    this.districtService.getAll()
      .then(districts => {
        console.log(JSON.stringify(districts));
      });
  }

  loadWards() {
    this.wardService.getAll()
      .then(wards => {
        console.log(JSON.stringify(wards));
      });
  }


  loadProduct() {
    this.productService.getAll()
      .then(products => {

        console.log(products);

        var data: {
          Id: string,
          Name: string,
          Category: number,
          Price: string
        }[] = [];

        products.forEach(product => {

          data.push({
            Id: product.Id,
            Name: product.Name,
            Category: product.ProductCategories,
            Price: product.Price
          });

        });

        console.log(JSON.stringify(data));

      })
  }
}
