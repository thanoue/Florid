import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, retry } from 'rxjs/operators';
import { MenuItem } from '../../models/view.models/menu.model';
import { NgForm } from '@angular/forms';
import { TempProductService } from 'src/app/services/tempProduct.service';
import { TempProduct } from 'src/app/models/entities/file.entity';
import { ExchangeService } from 'src/app/services/exchange.service';

declare function getNumberInput(resCallback: (res: number) => void, placeHolder: string): any;
declare function createNumbericElement(isDisabled: boolean, calback: (val: number) => void): any;
// declare function selectProductCategory(menuitems: { Name: string; Value: ProductCategories; }[], callback: (index: any) => void): any;

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

    this.route.params.subscribe(params => {

      this.detailIndex = + params.id;


      this.orderDetail = this.globalOrderDetail;

      this.orderDetail.AdditionalFee /= 1000;

      createNumbericElement(this.detailIndex > -1, (val) => {
        this.orderDetail.Quantity = val;
      });

    });

  }

  destroy() {
    if (this.globalOrderDetail) {
      this.globalOrderDetail.AdditionalFee *= 1000;
    }
  }

  insertModifiedValue() {
    getNumberInput(res => {
      this.orderDetail.ModifiedPrice = res;
    }, 'Cập nhật giá...');
  }

  searchProduct() {

    // selectProductCategory(PRODUCTCATEGORIES, (val) => {

    //   this.router.navigate(['/search-product'], { queryParams: { category: +val }, queryParamsHandling: 'merge' });

    // });

  }

  submitOrderDetail(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (!this.globalOrderDetail.DeliveryInfo.Address
      || !this.globalOrderDetail.DeliveryInfo.PhoneNumber
      || !this.globalOrderDetail.DeliveryInfo.FullName
      || !this.globalOrderDetail.DeliveryInfo.DateTime) {
      this.showWarning('Thiếu thông in giao hàng!');
      return;
    }

    if (this.globalOrderDetail.ModifiedPrice <= 0) {
      this.showWarning('Chưa nhập giá tiền!');
      return;
    }

    if (!this.globalOrderDetail.IsFromHardCodeProduct && (!this.globalOrderDetail.ProductId || this.globalOrderDetail.ProductId === '')) {
      this.showWarning('Chưa chọn sản phẩm');
      return;
    }

    this.globalOrderDetail.Index = this.detailIndex > -1 ? this.detailIndex : this.globalOrder.OrderDetails.length;

    const viewModel = OrderDetailViewModel.DeepCopy(this.globalOrderDetail);

    this.globalOrderDetail = null;

    this.insertOrderDetail(viewModel);
  }

  insertOrderDetail(viewModel: OrderDetailViewModel) {

    viewModel.AdditionalFee *= 1000;
    const newIndexes: number[] = [];

    if (this.detailIndex > -1) {

      this.globalOrder.OrderDetails[this.detailIndex] = viewModel;

    } else {

      let index = viewModel.Index;

      for (let i = 0; i < viewModel.Quantity; i++) {

        const subItem = OrderDetailViewModel.DeepCopy(viewModel);

        subItem.Quantity = 1;

        subItem.Index = index;

        this.globalOrder.OrderDetails.push(subItem);

        newIndexes.push(index);

        index += 1;
      }
    }

    super.OnBackNaviage();
  }
}
