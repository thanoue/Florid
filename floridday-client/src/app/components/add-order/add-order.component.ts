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
import { District, Ward } from 'src/app/models/entities/address.entity';
import { DistrictAddressService } from 'src/app/services/address/district-address.service';
import { WardAddressService } from 'src/app/services/address/ward-address.service';
import { PrintSaleItem, PrintJob } from 'src/app/models/entities/printjob.entity';
import { Guid } from 'guid-typescript';
import { PrintJobService } from 'src/app/services/print-job.service';

declare function openExcForm(resCallback: (result: number, validateCalback: (isSuccess: boolean) => void) => void): any;
declare function getNumberValidateInput(resCallback: (res: number, validCallback: (isvalid: boolean, error: string) => void) => void, placeHolder: string, oldValue: number): any;

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent extends BaseComponent {

  Title = 'Thêm Đơn';

  memberShipTitle = '';

  order: OrderViewModel;

  totalBalance = 0;

  isResetPaidAmount = false;

  constructor(private orderDetailService: OrderDetailService, private router: Router,
    // tslint:disable-next-line: align
    private orderService: OrderService, public auth: AngularFireAuth,
    // tslint:disable-next-line: align
    private customerService: CustomerService,

    // tslint:disable-next-line: align
    private printJobService: PrintJobService) {
    super();
  }


  protected Init() {

    this.order = this.globalOrder;

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
    this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;
  }

  requestPaidInput() {

    if (!this.order.CustomerInfo.Id) {
      this.showWarning('Thiếu thông tin Khách hàng!');
      return;
    }

    if (!this.order.OrderDetails || this.order.OrderDetails.length <= 0) {
      this.showWarning('Chưa chọn sản phẩm nào!');
      return;
    }

    if (!this.order.TotalAmount || this.order.TotalAmount <= 0) {
      this.showWarning('Thành tiền không hợp lệ!');
      return;
    }

    if (this.totalBalance < 0) {

      this.openConfirm('Trả lại tiền thừa cho khách hàng : ' + this.totalBalance.toString(), () => {

        this.isResetPaidAmount = true;
        this.totalBalance = 0;

        this.printConfirm();

      });

      return;
    }

    if (this.totalBalance === 0) {
      this.printConfirm();
      return;
    }

    getNumberValidateInput((res, validateCallback) => {

      if (res > this.totalBalance) {
        validateCallback(false, 'Thanh toán vượt quá thành tiền!');
        return;
      } else if (res <= 0) {
        validateCallback(false, 'Thanh toán phải lớn hơn 0!');
        return;
      }

      validateCallback(true, '');
      this.doingPay(res);

    }, 'Số tiền đã thanh toán...', this.totalBalance);

  }

  doingPay(res: number) {

    this.order.TotalPaidAmount += res;

    this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;

    if (!this.order.CreatedDate) { this.order.CreatedDate = new Date(); }

    this.order.CustomerInfo.GainedScore = ExchangeService.getGainedScore(this.order.TotalAmount);

    if (!this.order.OrderId) {

      this.startLoading();

      this.orderService.getNextIndex()
        .then(nextIndex => {

          this.stopLoading();

          this.order.OrderId = `DON_${nextIndex}`;

          this.printConfirm();

        });

    } else {

      this.printConfirm();

    }
  }

  printConfirm() {

    this.openConfirm('Có muốn in bill không?', () => {

      if (this.isResetPaidAmount) {
        this.order.TotalPaidAmount = this.order.TotalAmount;
      }

      let tempSummary = 0;
      const products: PrintSaleItem[] = [];

      this.order.OrderDetails.forEach(product => {
        products.push({
          productName: product.ProductName,
          index: product.Index + 1,
          price: product.ModifiedPrice,
          additionalFee: product.AdditionalFee
        });
        tempSummary += product.ModifiedPrice;
      });

      const orderData: PrintJob = {
        Created: (new Date()).getTime(),
        Id: Guid.create().toString(),
        Active: true,
        IsDeleted: false,
        saleItems: products,
        createdDate: this.order.CreatedDate.toLocaleString('vi-VN', { hour12: true }),
        orderId: this.order.OrderId,
        summary: tempSummary,
        totalAmount: this.order.TotalAmount,
        totalPaidAmount: this.order.TotalPaidAmount,
        totalBalance: this.totalBalance,
        vatIncluded: this.order.VATIncluded,
        memberDiscount: this.order.CustomerInfo.DiscountPercent,
        scoreUsed: this.order.CustomerInfo.ScoreUsed,
        gainedScore: this.order.CustomerInfo.GainedScore,
        totalScore: this.order.CustomerInfo.AvailableScore - this.order.CustomerInfo.ScoreUsed + this.order.CustomerInfo.GainedScore,
      };

      this.printJobService.set(orderData).then(res => {
        this.orderConfirm();
      })
        .catch(error => {
          this.showError(error);
          return;
        });

    }, () => {

      this.orderConfirm();

    }, () => {

      if (this.isResetPaidAmount) {
        this.isResetPaidAmount = false;
        this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;
      }

    });

  }

  orderConfirm() {

    if (this.isResetPaidAmount) {
      this.order.TotalPaidAmount = this.order.TotalAmount;
    }

    this.startLoading();

    const orderDB = new Order();

    orderDB.CustomerId = this.order.CustomerInfo.Id;
    orderDB.Id = this.order.OrderId;
    orderDB.AccountId = this.auth.auth.currentUser.uid;
    orderDB.Created = this.order.CreatedDate.getTime();
    orderDB.VATIncluded = this.order.VATIncluded;
    orderDB.TotalAmount = this.order.TotalAmount;
    orderDB.TotalPaidAmount = this.order.TotalPaidAmount;
    orderDB.GainedScore = this.order.CustomerInfo.GainedScore;
    orderDB.ScoreUsed = this.order.CustomerInfo.ScoreUsed;

    this.orderService.set(orderDB)
      .then(async res => {

        const orderDetais: OrderDetail[] = [];
        const receiverInfos: CustomerReceiverDetail[] = [];

        this.order.OrderDetails.forEach(detailVM => {

          const detail = new OrderDetail();

          detail.Id = Guid.create().toString();

          detail.OrderId = orderDB.Id;
          detail.IsHardcodeProduct = detailVM.IsFromHardCodeProduct;
          detail.HardcodeProductImageName = detailVM.HardcodeImageName;
          detail.ProductId = detailVM.ProductId;
          detail.ProductImageUrl = detailVM.ProductImageUrl;
          detail.ProductPrice = detailVM.ModifiedPrice;
          detail.AdditionalFee = detailVM.AdditionalFee;
          detail.ProductName = detailVM.ProductName;
          detail.Description = detailVM.Description;
          detail.Index = detailVM.Index;
          detail.State = OrderDetailStates.Waiting;
          detail.ProductModifiedPrice = detailVM.ModifiedPrice;

          detail.DeliveryInfo.ReceivingTime = detailVM.DeliveryInfo.DateTime.getTime();

          const receiverInfo = new CustomerReceiverDetail();

          receiverInfo.Address = detailVM.DeliveryInfo.Address;
          receiverInfo.PhoneNumber = detailVM.DeliveryInfo.PhoneNumber;
          receiverInfo.FullName = detailVM.DeliveryInfo.FullName;

          detail.DeliveryInfo.ReceiverDetail = receiverInfo;

          orderDetais.push(detail);

          let isAdd = true;

          receiverInfos.forEach(info => {

            if (ExchangeService.receiverInfoCompare(info, receiverInfo)) {
              isAdd = false;
              return;
            }

          });

          if (isAdd) {
            receiverInfos.push(receiverInfo);
          }

        });

        this.globalOrder.CustomerInfo.ReceiverInfos.forEach(receiver => {

          let isAdd = true;

          receiverInfos.forEach(item => {

            if (ExchangeService.receiverInfoCompare(receiver, item)) {
              isAdd = false;
              return;
            }

          });

          if (isAdd) {
            receiverInfos.push(receiver);
          }

        });

        const removeOldRes = await this.orderDetailService.deleteAllByOrderId(orderDB.Id);

        if (!removeOldRes) {

          this.globalService.stopLoading();
          return;

        } else {

          this.orderDetailService.setList(orderDetais)
            .then(() => {

              this.customerService.updateReceiverList(orderDB.CustomerId, receiverInfos).then(isSuccess => {
                this.stopLoading();
                if (isSuccess) {
                  this.OnBackNaviage();
                }
              });

            })
            .catch(error => {

              console.log(error);
              this.globalService.stopLoading();
              this.showError(error.toString());

            });
        }
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

    this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;

  }

  onVATIncludedChange() {
    if (this.order.VATIncluded) {
      this.totalAmountCalculate();
    } else {
      this.totalAmountCalculate();
      this.order.TotalAmount += (this.order.TotalAmount / 100) * 10;
      this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;
    }
  }

  scoreExchange() {

    openExcForm((res, validateCalback) => {

      if (this.order.CustomerInfo.AvailableScore < res) {

        this.showError('Vượt quá điểm tích lũy!!');

        validateCalback.call(this, false);

        return;

      }

      const exchangeAmount = ExchangeService.geExchangableAmount(res);

      if (exchangeAmount >= this.totalBalance) {

        this.showError('Vượt quá tổng tiền thanh toán!');

        validateCalback.call(this, false);

        return;

      }

      validateCalback.call(this, true);

      console.log('exchange amout:', res);

      this.order.CustomerInfo.ScoreUsed = res;

      this.totalAmountCalculate();

    });

  }

  addNewOrderDetail() {

    this.globalOrderDetail = new OrderDetailViewModel();

    this.router.navigate([`/order-detail/-1`]);
  }

  editOrderDetail(index: number) {

    const viewModel = OrderDetailViewModel.DeepCopy(this.order.OrderDetails[index]);

    this.globalOrderDetail = viewModel;

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
