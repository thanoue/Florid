import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MenuItem } from '../../models/view.models/menu.model';
import { ProductCategories } from 'src/app/models/enums';
import { PRODUCTCATEGORIES } from 'src/app/app.constants';
import { NgForm } from '@angular/forms';
import { TempProductService } from 'src/app/services/tempProduct.service';
import { TempProduct } from 'src/app/models/entities/file.entity';

declare function getNumberInput(resCallback: (res: number) => void, placeHolder: string): any;
declare function createNumbericElement(isDisabled: boolean, calback: (val: number) => void): any;
declare function selectProductCategory(menuitems: { Name: string; Value: ProductCategories; }[], callback: (index: any) => void): any;

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent extends BaseComponent implements OnDestroy {

  Title = 'Chi tiết đơn';

  orderDetail: OrderDetailViewModel;
  detailIndex: number;

  constructor(private route: ActivatedRoute, private router: Router, private tempProductService: TempProductService) {
    super();

  }

  protected Init() {

    this.orderDetail = this.currentGlobalOrderDetail;

    this.orderDetail.AdditionalFee /= 1000;

    this.route.params.subscribe(params => {
      this.detailIndex = + params.id;

      createNumbericElement(this.detailIndex > -1, (val) => {
        this.orderDetail.Quantity = val;
      });

    });

  }

  destroy() {
    if (this.currentGlobalOrderDetail) {
      this.currentGlobalOrderDetail.AdditionalFee *= 1000;
    }
  }

  insertModifiedValue() {
    getNumberInput(res => {
      this.orderDetail.ModifiedPrice = res;
    }, 'Cập nhật giá...');
  }

  searchProduct() {

    selectProductCategory(PRODUCTCATEGORIES, (val) => {

      this.router.navigate(['/search-product'], { queryParams: { category: +val }, queryParamsHandling: 'merge' });

    });

  }

  submitOrderDetail(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.currentGlobalOrderDetail.Index = this.detailIndex > -1 ? this.detailIndex : this.currentGlobalOrder.OrderDetails.length;

    const viewModel = OrderDetailViewModel.DeepCopy(this.currentGlobalOrderDetail);

    this.currentGlobalOrderDetail = null;

    this.insertOrderDetail(viewModel);
  }

  insertOrderDetail(viewModel: OrderDetailViewModel) {

    viewModel.AdditionalFee *= 1000;

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
