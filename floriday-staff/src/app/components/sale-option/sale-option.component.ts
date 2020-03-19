import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderViewModel } from 'src/app/models/view.models/order.model';
import { sha256, sha224 } from 'js-sha256';
import { environment } from 'src/environments/environment';

declare function getMomoConfig(): any;
declare function openQR(): any;

@Component({
  selector: 'app-sale-option',
  templateUrl: './sale-option.component.html',
  styleUrls: ['./sale-option.component.css']
})
export class SaleOptionComponent extends BaseComponent {

  Title = 'Thanh toán';
  protected IsDataLosingWarning = false;
  order: OrderViewModel;
  inputAmount = 0;
  qrCodeData = 'data';

  protected Init() {
    this.order = this.currentGlobalOrder;
  }

  momoPurchase() {

    if (this.inputAmount <= 0) {
      this.showError('Chưa nhập số tiền!!');
      return;
    }

    const momoConfig = getMomoConfig();

    console.log(momoConfig);

    const storeSlug = `${momoConfig.partnerCode}-${momoConfig.storeId}`;

    const currentTime = new Date();
    const billId = `florid_bill_${currentTime.getTime()}`;

    const regex = new RegExp('^[0-9a-zA-Z]([-_.]*[0-9a-zA-Z]+)*$');

    if (!regex.test(billId)) {
      this.showError('Lỗi mã giao dịch!!');
      return;
    }

    const rawSignature = `storeSlug=${storeSlug}&amount=${this.inputAmount}&billId=${billId}`;

    const signature = sha256.hmac.create(momoConfig.secretkey).update(rawSignature).hex();

    console.log('signature:', signature);

    this.qrCodeData = `${environment.momo_generate_qr_domain}/pay/store/${storeSlug}?a=${this.inputAmount}&b=${billId}&s=${signature}`;

    openQR();
  }
}
