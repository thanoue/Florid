import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates } from 'src/app/models/enums';
import { StorageService } from 'src/app/services/storage.service';

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

  protected Init() {
    this.orderDetail = this.globalOrderDetail;
  }

  constructor(private orderDetailService: OrderDetailService, private storageService: StorageService) {
    super();
  }


  confirmOrderDetail() {

    let updates = {};

    updates[`/${this.orderDetail.OrderDetailId}/State`] = OrderDetailStates.Completed;
    updates[`/${this.orderDetail.OrderDetailId}/ShippingSortOrder`] = 0;

    this.orderDetailService.updateFields(updates)
      .then(() => {
        super.OnBackNaviage();
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
