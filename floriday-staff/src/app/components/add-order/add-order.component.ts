import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, MembershipTypes } from 'src/app/models/enums';
import { Router } from '@angular/router';

declare function openExcForm(resCallback: (result: number, validateCalback: (isSuccess: boolean) => void) => void): any;

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent extends BaseComponent {

  Title = 'Thêm Đơn';

  memberShipTitle = '';

  order: OrderViewModel;

  protected Init() {

    this.order = this.currentGlobalOrder;

    if (!this.order) {
      this.memberShipTitle = 'New Customer';
    }

    switch (this.order.CustomerInfo.MembershipType) {
      case MembershipTypes.NewCustomer:
        this.memberShipTitle = 'New Customer';
        break;
      case MembershipTypes.StandardMember:
        this.memberShipTitle = 'Standard Member';
        break;
      case MembershipTypes.VipMember:
        this.memberShipTitle = 'VIP';
        break;
      case MembershipTypes.VVipMember:
        this.memberShipTitle = 'VVIP';
        break;
      default:
        this.memberShipTitle = 'New Customer';
        break;
    }

  }

  scoreExchange() {

    openExcForm((res, validateCalback) => {

      if (this.order.CustomerInfo.AvailableScore < res) {

        this.showError('Vượt quá điểm tích lũy!!');

        validateCalback.call(this, false);

      } else {

        validateCalback.call(this, true);

        this.order.CustomerInfo.ScoreUsed = res;

      }

    });

  }

  addNewOrderDetail() {

    this.currentGlobalOrderDetail = new OrderDetailViewModel();

    this.router.navigate([`/order-detail/-1`]);
  }

  editOrderDetail(index: number) {

    const viewModel = OrderDetailViewModel.DeepCopy(this.order.OrderDetails[index]);

    this.currentGlobalOrderDetail = viewModel;

    this.router.navigate([`/order-detail/${index}`]);

  }

  deleteOrderDetail(index: number) {
    // confirm here
    this.openConfirm('Chắc chắn xoá?', () => {
      this.order.OrderDetails.splice(index, 1);

      let tempIndex = 0;

      this.order.OrderDetails.forEach(item => {
        item.Index = tempIndex;
        tempIndex++;
      });
    }, () => {

    });



  }


  constructor(private router: Router) {
    super();
  }


}
