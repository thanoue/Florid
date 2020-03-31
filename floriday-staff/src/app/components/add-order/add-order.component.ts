import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, MembershipTypes } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { ExchangeService } from 'src/app/services/exchange.service';
import { OrderService } from 'src/app/services/order.service';
import { Order, OrderDetail, CustomerReceiverDetail } from 'src/app/models/entities/order.entity';
import { AngularFireAuth } from '@angular/fire/auth';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { CustomerService } from 'src/app/services/customer.service';

declare function openExcForm(resCallback: (result: number, validateCalback: (isSuccess: boolean) => void) => void): any;
declare function getNumberInput(resCallback: (res: number) => void, placeHolder: string, oldValue: number): any;
declare function doPrintJob(data: {}): any;

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent extends BaseComponent {

  Title = 'Thêm Đơn';

  memberShipTitle = '';

  order: OrderViewModel;


  constructor(private orderDetailService: OrderDetailService, private router: Router,
    // tslint:disable-next-line: align
    private orderService: OrderService, public auth: AngularFireAuth,
    // tslint:disable-next-line: align
    private customerService: CustomerService) {
    super();
  }


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

        this.orderService.getNextIndex()

          .then(nextIndex => {

            this.order.OrderId = `DON_${nextIndex}`;

            this.printConfirm();

          });
      } else {
        this.printConfirm();
      }


    }, 'Số tiền đã thanh toán...', this.order.TotalAmount);

  }

  printConfirm() {

    this.openConfirm('Có muốn in bill không?', () => {
      if (!this.order.CreatedDate) {
        this.order.CreatedDate = new Date();
      }

      let tempSummary = 0;
      const products = [];
      this.order.OrderDetails.forEach(product => {
        products.push({
          productName: product.ProductName,
          index: product.Index + 1,
          price: product.ModifiedPrice,
          additionalFee: product.AdditionalFee
        });
        tempSummary += product.ModifiedPrice;
      });

      this.order.CustomerInfo.GainedScore = ExchangeService.getGainedScore(this.order.TotalAmount);


      let orderData = {
        saleItems: products,
        createdDate: this.order.CreatedDate.toLocaleString('vi-VN', { hour12: true }),
        orderId: this.order.OrderId,
        summary: tempSummary,
        totalAmount: this.order.TotalAmount,
        totalPaidAmount: this.order.TotalPaidAmount,
        totalBalance: this.order.TotalAmount - this.order.TotalPaidAmount,
        vatIncluded: this.order.VATIncluded,
        memberDiscount: this.order.CustomerInfo.DiscountPercent,
        scoreUsed: this.order.CustomerInfo.ScoreUsed,
        gainedScore: this.order.CustomerInfo.GainedScore,
        totalScore: this.order.CustomerInfo.AvailableScore - this.order.CustomerInfo.ScoreUsed + this.order.CustomerInfo.GainedScore,
      };

      doPrintJob(orderData);

      this.orderConfirm();

    }, () => {

      this.orderConfirm();

    });

  }

  orderConfirm() {
    this.startLoading();

    let orderDB = new Order();

    orderDB.CustomerId = this.order.CustomerInfo.Id;
    orderDB.Id = this.order.OrderId;
    orderDB.AccountId = this.auth.auth.currentUser.uid;
    orderDB.Created = this.order.CreatedDate.getTime();
    orderDB.VATIncluded = this.order.VATIncluded;
    orderDB.TotalAmount = this.order.TotalAmount;
    orderDB.TotalPaidAmount = this.order.TotalPaidAmount;
    orderDB.GainedScore = this.order.CustomerInfo.GainedScore;
    orderDB.ScoreUsed = this.order.CustomerInfo.ScoreUsed;

    this.orderService.insertWithId(orderDB, orderDB.Id)
      .then(res => {

        const orderDetais: OrderDetail[] = [];
        const receiverInfos: CustomerReceiverDetail[] = [];

        this.order.OrderDetails.forEach(detailVM => {

          const detail = new OrderDetail();

          detail.Id = `${orderDB.Id}_${detailVM.Index}`;
          detail.OrderId = this.order.OrderId;
          detail.IsHardcodeProduct = detailVM.IsFromHardCodeProduct;
          detail.HardcodeProductImageName = detailVM.HardcodeImageName;
          detail.ProductId = detailVM.ProductId;
          detail.ProductImageUrl = detailVM.ProductImageUrl;
          detail.ProductPrice = detailVM.ModifiedPrice;
          detail.AdditionalFee = detailVM.AdditionalFee;
          detail.ProductName = detailVM.ProductName;
          detail.Description = detailVM.Description;

          detail.ReceiverInfo.ReceivingTime = detailVM.DeliveryInfo.DateTime.getTime();

          const receiverInfo = new CustomerReceiverDetail();

          receiverInfo.Address = detailVM.DeliveryInfo.Address;
          receiverInfo.PhoneNumber = detailVM.DeliveryInfo.PhoneNumber;
          receiverInfo.FullName = detailVM.DeliveryInfo.Name;

          detail.ReceiverInfo.ReceiverDetail = receiverInfo;

          orderDetais.push(detail);

        });

        this.globalDeliveryInfos.forEach(item => {

          const receiverInfo = new CustomerReceiverDetail();

          receiverInfo.Address = item.Info.Address;
          receiverInfo.PhoneNumber = item.Info.PhoneNumber;
          receiverInfo.FullName = item.Info.Name;

          receiverInfos.push(receiverInfo);
        });

        this.orderDetailService.setList(orderDetais).then(() => {
          this.customerService.updateReceiverList(this.order.CustomerInfo.Id, receiverInfos).then(isSuccess => {
            this.stopLoading();
            if (isSuccess) {
              this.OnBackNaviage();
            }
          });
        })
          .catch(error => {
            this.globalService.stopLoading();
            this.showError(error);
          });

      });
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



}
