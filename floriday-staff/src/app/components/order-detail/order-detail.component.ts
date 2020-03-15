import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MenuItem } from '../../models/view.models/menu.model';
import { ProductCategories } from 'src/app/models/enums';
import { PRODUCTCATEGORIES } from 'src/app/app.constants';
import { NgForm } from '@angular/forms';

declare function getNumberInput(resCallback: (res: string) => void): any;
declare function createNumbericElement(): any;
declare function selectProductCategory(menuitems: { Name: string; Value: ProductCategories; }[], callback: (index: number) => void): any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent extends BaseComponent {

  Title = 'Chi tiết đơn';

  orderDetail: OrderDetailViewModel;
  detailIndex: number;

  protected Init() {

    this.orderDetail = this.currentGlobalOrderDetail;

    createNumbericElement();

    this.route.params.subscribe(params => {
      this.detailIndex = + params.id;
    });
  }

  protected OnNavigateClick() {
    // this.currentGlobalOrder.OrderDetails.pop();
    super.OnNavigateClick();
  }

  constructor(private route: ActivatedRoute, private router: Router) {
    super();

  }

  insertModifiedValue() {
    getNumberInput(res => {
      this.orderDetail.ModifiedPrice = res as unknown as number;
    });
  }

  searchProduct() {

    selectProductCategory(PRODUCTCATEGORIES, (val) => {

      this.router.navigate(['/search-product'], { queryParams: { category: val }, queryParamsHandling: 'merge' });

    });

  }

  submitOrderDetail(form: NgForm) {

    if (!form.valid) {
      return;
    }
    console.log(this.orderDetail);

    var index = this.detailIndex > -1 ? this.detailIndex : this.currentGlobalOrder.OrderDetails.length;

    this.currentGlobalOrderDetail.Index = index;

    const viewModel = OrderDetailViewModel.DeepCopy(this.currentGlobalOrderDetail);

    if (this.detailIndex > -1) {

      this.currentGlobalOrder.OrderDetails[this.detailIndex] = viewModel;

      this.currentGlobalOrderDetail = null;

    } else {

      this.currentGlobalOrder.OrderDetails.push(viewModel);

    }

    this.OnNavigateClick();
  }
}
