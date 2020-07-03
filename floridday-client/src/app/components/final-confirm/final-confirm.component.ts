import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, MembershipTypes } from 'src/app/models/enums';
import { StorageService } from 'src/app/services/storage.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer, MembershipInfo } from 'src/app/models/entities/customer.entity';
import { not } from '@angular/compiler/src/output/output_ast';
import { ExchangeService } from 'src/app/services/exchange.service';
import { TagService } from 'src/app/services/tag.service';
import { switchMapTo } from 'rxjs/operators';

declare function shareImageCusWithData(img: string): any;

@Component({
  selector: 'app-final-confirm',
  templateUrl: './final-confirm.component.html',
  styleUrls: ['./final-confirm.component.css']
})
export class FinalConfirmComponent extends BaseComponent {

  Title = 'Xác nhận giao hàng'
  orderDetail: OrderDetailViewModel;
  sharingImage = '';
  customer: Customer;

  protected Init() {

    this.orderDetail = this.globalOrderDetail;

    this.customerService.getById(this.globalOrder.CustomerInfo.Id).then(customer => {
      this.customer = customer;
    });

  }

  constructor(private orderDetailService: OrderDetailService, private storageService: StorageService, private customerService: CustomerService) {
    super();
  }


  confirmOrderDetail() {

    let updates = {};

    updates[`/${this.orderDetail.OrderDetailId}/State`] = OrderDetailStates.Completed;
    updates[`/${this.orderDetail.OrderDetailId}/ShippingSortOrder`] = 0;

    this.orderDetailService.updateFields(updates)
      .then(async () => {

        let orderDetails = await this.orderDetailService.getByFieldName('OrderId', this.orderDetail.OrderId);

        let notCompletedDetails = orderDetails.filter(p => p.State != OrderDetailStates.Completed && p.State != OrderDetailStates.Canceled);

        if (notCompletedDetails && notCompletedDetails.length > 0) {

          return;

        } else {

          let totalAmount = this.globalOrder.TotalAmount;

          orderDetails.forEach(detail => {
            if (detail.State == OrderDetailStates.Canceled) {
              totalAmount -= detail.ProductModifiedPrice;
            }
          });

          updates = {};

          let newMemberInfo = new MembershipInfo();
          newMemberInfo.AccumulatedAmount = this.customer.MembershipInfo.AccumulatedAmount + totalAmount;
          newMemberInfo.AvailableScore = this.customer.MembershipInfo.AvailableScore + ExchangeService.getGainedScore(totalAmount);
          newMemberInfo.UsedScoreTotal = this.customer.MembershipInfo.UsedScoreTotal + this.globalOrder.CustomerInfo.ScoreUsed;

          if (newMemberInfo.AccumulatedAmount < 5000000) {
            newMemberInfo.MembershipType = MembershipTypes.NewCustomer;
          }

          if (newMemberInfo.AccumulatedAmount >= 5000000 && newMemberInfo.AccumulatedAmount < 10000000) {
            newMemberInfo.MembershipType = MembershipTypes.Member;
          }

          if (newMemberInfo.AccumulatedAmount >= 10000000 && newMemberInfo.AccumulatedAmount < 30000000) {
            newMemberInfo.MembershipType = MembershipTypes.Vip;
          }

          if (newMemberInfo.AccumulatedAmount >= 30000000) {
            newMemberInfo.MembershipType = MembershipTypes.VVip;
          }

          updates[`/${this.customer.Id}/MembershipInfo`] = newMemberInfo;

          this.customerService.updateSingleField(this.customer.Id, 'MembershipInfo', newMemberInfo)
            .then(() => {
              this.location.back();
            });
        }

      });

  }

  shareToCus() {

    if (this.IsOnTerminal) {
      if (this.sharingImage == '') {

        this.startLoading();

        this.storageService.downloadFIle(this.orderDetail.DeliveryImageUrl, (file) => {

          this.stopLoading();

          var reader = new FileReader();

          reader.readAsDataURL(file);

          reader.onloadend = () => {

            var base64data = reader.result.toString();
            this.sharingImage = base64data;

            shareImageCusWithData(this.sharingImage);

          }

        });
      } else {

        shareImageCusWithData(this.sharingImage);

      }

    } else {
      shareImageCusWithData(this.orderDetail.DeliveryImageUrl);
    }


  }

}
