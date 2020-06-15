import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { StorageService } from 'src/app/services/storage.service';
import { ResultImageService } from 'src/app/services/result.image.service';
import { ResultImage, DeliveryImage } from 'src/app/models/entities/file.entity';
import html2canvas from 'html2canvas';
import { Role } from 'functions/src/helper/role';
import { DeliveryImageService } from 'src/app/services/delivery.image.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/entities/order.entity';
import { OrderService } from 'src/app/services/order.service';

declare function shareImageCus(): any;
declare function deleteTempImage(): any;
declare function shareOnWeb(file: string): any;
declare function getNumberValidateInput(resCallback: (res: number, validCallback: (isvalid: boolean, error: string) => void) => void, placeHolder: string, oldValue: number): any;

@Component({
  selector: 'app-customer-confirm',
  templateUrl: './customer-confirm.component.html',
  styleUrls: ['./customer-confirm.component.css']
})
export class CustomerConfirmComponent extends BaseComponent {

  Title = 'Xác nhận với khách hàng';
  edittingFile: File = null;
  edittingImageUrl: string = '';
  selectedBlob: Blob;
  orderDetail: OrderDetailViewModel;
  order: Order;
  totalBalance = 0;

  protected Init() {
    this.orderDetail = this.globalOrderDetail;
    this.orderService.getById(this.orderDetail.OrderId)
      .then(order => {
        this.order = order;
        this.totalBalance = this.order.TotalAmount - this.order.TotalPaidAmount;
      });
  }

  constructor(private orderDetailService: OrderDetailService,
    private resultImageService: ResultImageService,
    private deliveryImageService: DeliveryImageService,
    private router: Router,
    private orderService: OrderService) {
    super();
  }

  protected fileChosen(path: string) {
    this.edittingImageUrl = 'data:image/png;base64,' + path;
  }

  onChange(event) {

    const filesUpload: File = event.target.files[0];

    var mimeType = filesUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.showError('Phải chọn hình !!');
      return;
    }

    this.edittingFile = filesUpload;

    var reader = new FileReader();

    reader.readAsDataURL(filesUpload);
    reader.onload = (_event) => {

      this.edittingImageUrl = reader.result.toString();
    }
  }

  partPay() {

    getNumberValidateInput((res, validateCallback) => {

      if (res > this.totalBalance) {
        validateCallback(false, 'Thanh toán vượt quá thành tiền!');
        return;
      } else if (res <= 0) {
        validateCallback(false, 'Thanh toán phải lớn hơn 0!');
        return;
      }

      validateCallback(true, '');

      this.orderService.updateSingleField(this.order.Id, 'TotalPaidAmount', this.order.TotalPaidAmount + res)
        .then(() => {
          this.confirm();
        });

    }, 'Số tiền thanh toán...', this.totalBalance);

  }

  confirm() {

    switch (this.CurrentUser.Role) {
      case Roles.Account:
      case Roles.Admin:

        if (this.edittingImageUrl != '') {
          deleteTempImage();
        }
        else {
          return;
        }

        let resultImageFile = new ResultImage();
        resultImageFile.Name = `result_image_${(new Date().getTime().toString())}`;

        if (this.edittingFile != null) {

          this.resultImageService.addFile(this.edittingFile, resultImageFile, (url) => {
            this.updateState(url);
          });

        } else {
          this.resultImageService.addFileFromBase64String(this.edittingImageUrl, resultImageFile, (url) => {
            this.updateState(url);
          });
        }
        break;
      case Roles.Shipper:

        let deliveryImageFile = new DeliveryImage();
        deliveryImageFile.Name = `delivery_image_${(new Date().getTime().toString())}`;

        if (this.edittingFile != null) {

          this.deliveryImageService.addFile(this.edittingFile, deliveryImageFile, (url) => {
            this.updateState(url);
          });

        } else {
          this.deliveryImageService.addFileFromBase64String(this.edittingImageUrl, deliveryImageFile, (url) => {
            this.updateState(url);
          });
        }
        break;
      default:
        break;
    }

  }

  updateState(url: string) {
    switch (this.CurrentUser.Role) {
      case Roles.Admin:
      case Roles.Account:
        this.orderDetailService.getNextShippingSortOrder()
          .then((nextOrder) => {

            let updates = {};

            updates[`/${this.orderDetail.OrderDetailId}/State`] = OrderDetailStates.DeliveryWaiting;
            updates[`/${this.orderDetail.OrderDetailId}/ShippingSortOrder`] = nextOrder;
            updates[`/${this.orderDetail.OrderDetailId}/ResultImageUrl`] = url;

            this.orderDetailService.updateFields(updates)
              .then(() => {
                super.OnBackNaviage();
              });

          });
        break;
      case Roles.Shipper:

        let updates = {};

        updates[`/${this.orderDetail.OrderDetailId}/State`] = OrderDetailStates.Deliveried;
        updates[`/${this.orderDetail.OrderDetailId}/ShippingSortOrder`] = 0;
        updates[`/${this.orderDetail.OrderDetailId}/DeliveryImageUrl`] = url;

        this.orderDetailService.updateFields(updates)
          .then(() => {
            this.router.navigate(['/shipper-main']);
          });

        break;
      default:
        break;
    }

  }

  shareForCus() {

    if (this.edittingImageUrl == '') {
      return;
    }

    if (this.IsOnTerminal) {

      shareImageCus();

    } else {

      if (this.edittingImageUrl)
        shareOnWeb(this.edittingImageUrl);

    }
  }
}
