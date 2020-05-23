import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { ReceiptService } from 'src/app/services/receipt.service';
import { Receipt } from 'src/app/models/entities/file.entity';
import { OrderViewModel } from 'src/app/models/view.models/order.model';
import { ExchangeService } from 'src/app/services/exchange.service';

declare function doPrintJob(url: string): any;
declare function actionMenuSelecting(menuitems: { Name: string; Value: string; }[], callback: (index: any) => void): any;


@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.css']
})
export class PrinterComponent extends BaseComponent {

  Title = '';
  order: OrderViewModel;
  protected IsDataLosingWarning = false;
  totalAmount = 0;
  createdDate: string;

  constructor(private router: Router, private receiptService: ReceiptService) {
    super();
  }

  protected Init() {

    this.order = this.globalOrder;

    this.order.OrderDetails.forEach(detail => {
      this.totalAmount += detail.ModifiedPrice;
    });

    this.createdDate = this.order.CreatedDate.toLocaleString('vi-VN', { hour12: true });

    this.order.CustomerInfo.GainedScore = ExchangeService.getGainedScore(this.order.TotalAmount);

    setTimeout(() => {
      const menuItems = [
        {
          Name: 'In Hoá Đơn',
          Value: 'PrintBill'
        },
        {
          Name: 'Tải lên Server',
          Value: 'UploadToServer'
        },
        {
          Name: 'Bỏ qua',
          Value: 'Ignore'
        },
        {
          Name: 'Trở về',
          Value: 'Back'
        }
      ];
      actionMenuSelecting(menuItems, (val) => {
        switch (val) {
          case 'PrintBill':
            this.doPrintJob();
            break;
          case 'UploadToServer':
            break;
          case 'Ignore':
            break;
          case 'Back':
            break;
        }
      });

    }, 4000);
  }

  doPrintJob() {
    setTimeout(() => {
      html2canvas(document.getElementById('receipt-form')).then((canvas) => {

        canvas.toBlob((blob => {

          const receipt = new Receipt();
          receipt.OrderId = this.order.OrderId;
          receipt.CustomerId = this.order.CustomerInfo.Id;
          receipt.Id = `${this.order.OrderId}_receipt`;

          receipt.Name = `${this.order.OrderId}_receipt.png`;

          this.receiptService.uploadReceipt(blob, receipt, receipt.Id, (url => {
            doPrintJob(url);
          }));

        }), 'image/png', 1);

      });
    }, 2000);


  }

}
