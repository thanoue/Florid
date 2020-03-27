import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, MembershipTypes } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { ExchangeService } from 'src/app/services/exchange.service';
import { OrderService } from 'src/app/services/order.service';

declare function openExcForm(resCallback: (result: number, validateCalback: (isSuccess: boolean) => void) => void): any;
declare function getNumberInput(resCallback: (res: number) => void, placeHolder: string, oldValue: number): any;

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
    } else {
      this.onVATIncludedChange();
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

  requestPaidInput() {

    getNumberInput((res) => {

      this.order.TotalPaidAmount = res;

      if (!this.order.OrderId) {

        this.orerService.getNextIndex()
          .then(nextIndex => {

            this.order.OrderId = `DON_${nextIndex}`;

            if (!this.order.CreatedDate) {
              this.order.CreatedDate = new Date();
            }

            this.router.navigate(['/print-job']);

          });
      }
      this.router.navigate(['/print-job']);

    }, 'Số tiền đã thanh toán...', this.order.TotalAmount);

  }

  totalAmountCalculate() {
    this.order.TotalAmount = 0;

    this.order.OrderDetails.forEach(detail => {
      if (!detail.AdditionalFee) {
        detail.AdditionalFee = 0;
      }
      this.order.TotalAmount += ExchangeService.getFinalPrice(detail.ModifiedPrice, this.order.CustomerInfo.DiscountPercent, detail.AdditionalFee);
    });

    this.order.TotalAmount -= ExchangeService.geExchangableAmount(this.order.CustomerInfo.ScoreUsed);

  }

  onVATIncludedChange() {
    if (this.order.VATIncluded) {
      this.totalAmountCalculate();
    } else {
      this.totalAmountCalculate();
      this.order.TotalAmount += (this.order.TotalAmount / 100) * 10;
    }
  }

  scoreExchange() {

    openExcForm((res, validateCalback) => {

      if (this.order.CustomerInfo.AvailableScore < res) {

        this.showError('Vượt quá điểm tích lũy!!');

        validateCalback.call(this, false);

      } else {

        validateCalback.call(this, true);

        this.order.TotalAmount += ExchangeService.geExchangableAmount(this.order.CustomerInfo.ScoreUsed);

        this.order.CustomerInfo.ScoreUsed = res;

        this.order.TotalAmount -= ExchangeService.geExchangableAmount(this.order.CustomerInfo.ScoreUsed);
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

      this.onVATIncludedChange();

    });
  }


  constructor(private router: Router, private orerService: OrderService) {
    super();
  }


}
