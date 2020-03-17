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
declare function createNumbericElement(isDisabled: boolean, calback: (val: number) => void): any;
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


    this.route.params.subscribe(params => {
      this.detailIndex = + params.id;

      createNumbericElement(this.detailIndex > -1, (val) => {
        this.orderDetail.Quantity = val;
      });

    });

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

    this.currentGlobalOrderDetail.Index = this.detailIndex > -1 ? this.detailIndex : this.currentGlobalOrder.OrderDetails.length;

    const viewModel = OrderDetailViewModel.DeepCopy(this.currentGlobalOrderDetail);

    this.currentGlobalOrderDetail = null;

    if (this.detailIndex > -1) {

      this.currentGlobalOrder.OrderDetails[this.detailIndex] = viewModel;

    } else {

      let index = viewModel.Index;

      for (let i = 0; i < viewModel.Quantity; i++) {

        const subItem = OrderDetailViewModel.DeepCopy(viewModel);

        subItem.Quantity = 1;

        subItem.Index = index;

        this.currentGlobalOrder.OrderDetails.push(subItem);

        index += 1;

      }

    }

    super.OnBackNaviage();
  }
}
