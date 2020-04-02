import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap, retry } from 'rxjs/operators';
import { MenuItem } from '../../models/view.models/menu.model';
import { ProductCategories } from 'src/app/models/enums';
import { PRODUCTCATEGORIES } from 'src/app/app.constants';
import { NgForm } from '@angular/forms';
import { TempProductService } from 'src/app/services/tempProduct.service';
import { TempProduct } from 'src/app/models/entities/file.entity';
import { ExchangeService } from 'src/app/services/exchange.service';

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




    this.route.params.subscribe(params => {

      this.detailIndex = + params.id;

      this.globalOrderDetail.Index = this.detailIndex > -1 ? this.detailIndex : this.globalOrder.OrderDetails.length;

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

    selectProductCategory(PRODUCTCATEGORIES, (val) => {

      this.router.navigate(['/search-product'], { queryParams: { category: +val }, queryParamsHandling: 'merge' });

    });

  }

  submitOrderDetail(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (!this.globalOrderDetail.DeliveryInfo.Address
      || !this.globalOrderDetail.DeliveryInfo.PhoneNumber
      || !this.globalOrderDetail.DeliveryInfo.Name
      || !this.globalOrderDetail.DeliveryInfo.DateTime) {
      this.showWarning('Thiếu thông in giao hàng!');
      return;
    }

    let isNew = true;

    this.globalDeliveryInfos.forEach(item => {

      if (item.Info.Address.toLowerCase() === this.globalOrderDetail.DeliveryInfo.Address.toLowerCase()
        && item.Info.Name.toLowerCase() === this.globalOrderDetail.DeliveryInfo.Name.toLowerCase()
        && item.Info.PhoneNumber.toLowerCase() === this.globalOrderDetail.DeliveryInfo.PhoneNumber.toLowerCase()
        && ExchangeService.dateCompare(item.Info.DateTime, this.globalOrderDetail.DeliveryInfo.DateTime)) {
        isNew = false;
      }

    });

    let isAdd = true;

    const newItem = { CustomerId: '', DetailIndex: [this.globalOrderDetail.Index], Info: this.globalOrderDetail.DeliveryInfo };

    if (isNew) {

      this.globalDeliveryInfos.forEach(item => {

        const index = item.DetailIndex.indexOf(this.globalOrderDetail.Index, 0);

        if (item.DetailIndex.length > 0 && index > -1) {

          isAdd = false;

          if (item.DetailIndex.length === 1) {
            item.Info = this.globalOrderDetail.DeliveryInfo;
            return;
          }

          item.DetailIndex.splice(index, 1);
          return;

        }

      });

      if (!isAdd) {
        this.globalDeliveryInfos.push(newItem);
      }

      console.log(this.globalDeliveryInfos);

    }

    const viewModel = OrderDetailViewModel.DeepCopy(this.globalOrderDetail);

    this.globalOrderDetail = null;

    this.insertOrderDetail(viewModel, (indexes) => {

      if (!isAdd || !isNew) {
        return;
      }

      this.globalDeliveryInfos.push({ CustomerId: '', DetailIndex: indexes, Info: this.globalOrderDetail.DeliveryInfo });

    });
  }

  insertOrderDetail(viewModel: OrderDetailViewModel, indexesCallback: (indexes: number[]) => void) {

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

      indexesCallback(newIndexes);

    }

    super.OnBackNaviage();
  }
}
