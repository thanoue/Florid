import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, Sexes, MembershipTypes } from 'src/app/models/enums';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from 'src/app/models/entities/customer.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent extends BaseComponent {


  protected PageCompnent: PageComponent = new PageComponent('Tag Sản Phẩm', MenuItems.ProductTag);

  isSelectAll: boolean = false;
  currentPage = 1;

  tagAlias = '';
  sexes = Sexes;

  currentCustomer: Customer;

  customers: {
    Customer: Customer,
    IsChecked: boolean
  }[];

  pageCount = 0;
  itemTotalCount = 0;

  _itemsPerPage: number;

  get itemPerpage(): number {
    return this._itemsPerPage;
  }

  set itemPerpage(val: number) {
    this._itemsPerPage = val;
    this.pageCount = 0;

    this.pageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;
    this.pageChanged(1);
  }

  constructor(private customerService: CustomerService) {
    super();
    this.currentCustomer = new Customer();
  }


  addCustomer(form: NgForm) {

    if (!form.valid) {
      return;
    }


    this.currentCustomer.MembershipInfo.AccumulatedAmount *= 1000;

    this.currentCustomer.MembershipInfo.AvailableScore = ExchangeService.getGainedScore(this.currentCustomer.MembershipInfo.AccumulatedAmount) - this.currentCustomer.MembershipInfo.UsedScoreTotal;

    if (this.currentCustomer.MembershipInfo.AvailableScore < 0) {
      this.showError('Điểm đã sử dụng không hợp lệ!');
      this.currentCustomer.MembershipInfo.AccumulatedAmount /= 1000;
      return;
    }

    this.startLoading();

    this.customerService.getCount()
      .then(count => {

        this.currentCustomer.Index = count + 1;

        this.customerService.set(this.currentCustomer).then(res => {

          this.stopLoading();

          this.itemTotalCount = this.currentCustomer.Index;

          this.pageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;

          if (this.currentPage === this.pageCount) {

            this.pageChanged(this.currentPage);

          }

          this.currentCustomer = new Customer();

          this.globalService.hidePopup();

        })
      });
  }

  protected Init() {
    this.customerService.getCount().then(count => {

      this.itemTotalCount = count;
      this._itemsPerPage = 10
      this.customers = [];

      this.pageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;

      this.pageChanged(1);

    });
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.customerService.getByPage(page, this._itemsPerPage).then(customers => {
      this.customers = [];
      customers.forEach(customer => {
        this.customers.push({
          Customer: customer,
          IsChecked: false
        });
      })
    });
  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.customers.forEach(tag => {
      tag.IsChecked = isCheck;
    });
  }

  deletecustomers() {

    var seletedcustomers = this.customers.filter(p => p.IsChecked);

    if (seletedcustomers.length <= 0) {
      return;
    }

    this.openConfirm('Chắc chắn xoá các tag sản phẩm?', () => {

      this.startLoading();

      let ids: string[] = [];
      let smallestTagIndex = seletedcustomers[0].Customer.Index;

      seletedcustomers.forEach(customer => {

        ids.push(customer.Customer.Id);

        if (smallestTagIndex > customer.Customer.Index) {
          smallestTagIndex = customer.Customer.Index;
        }

      })

      this.customerService.deleteMany(ids).then(() => {
        this.customerService.updateIndex(smallestTagIndex).then(res => {

          this.stopLoading();

          this.itemTotalCount -= seletedcustomers.length;
          this.customers = [];

          var newPageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;

          if (newPageCount != this.pageCount) {

            this.pageCount = newPageCount;
            this.pageChanged(1);

          } else {

            this.pageChanged(this.currentPage);

          }

          this.pageChanged(1);
        })
          .catch(error => {
            this.stopLoading();
            this.showError(error);
          });
      });

    });
  }

  deleteTag(tag: Customer) {

    this.openConfirm('Chắc chắn xoá tag sản phẩm?', () => {

      this.startLoading();

      this.customerService.delete(tag.Id).then(() => {

        this.customerService.updateIndex(tag.Index).then(res => {
          this.stopLoading();

          this.itemTotalCount -= 1;
          this.customers = [];

          var newPageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;

          if (newPageCount != this.pageCount) {

            this.pageCount = newPageCount;
            this.pageChanged(1);

          } else {

            this.pageChanged(this.currentPage);

          }

        })
          .catch(error => {
            this.stopLoading();
            this.showError(error);
          });

      });
    });
  }


}
