import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MenuItem } from '../../models/view.models/menu.model';
import { ProductCategories } from 'src/app/models/enums';
import { PRODUCTCATEGORIES } from 'src/app/app.constants';

declare function getInput(resCallback: (res: string) => void): any;
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

    this.orderDetail = new OrderDetailViewModel();

    this.route.params.subscribe(params => {
      const index = params.id;
      this.detailIndex = index;
      this.orderDetail = this.currentGlobalOrder.OrderDetails[index];
    });

    createNumbericElement();

  }

  protected OnNavigateClick() {
    this.currentGlobalOrder.OrderDetails.pop();
    super.OnNavigateClick();
  }

  constructor(private route: ActivatedRoute, private router: Router) {
    super();

  }

  insertModifiedValue() {
    getInput(res => {
      this.orderDetail.ModifiedPrice = res as unknown as number;
    });
  }

  searchProduct() {

    selectProductCategory(PRODUCTCATEGORIES, (val) => {
      // tslint:disable-next-line:max-line-length
      this.router.navigate(['/search-product'], { queryParams: { orderDetailId: this.detailIndex, category: val }, queryParamsHandling: 'merge' });
    });

  }
}
