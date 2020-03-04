import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { LocalService } from 'src/app/services/common/local.service';
import { Router, ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';
import { ReceiptService } from 'src/app/services/receipt.service';
import { Receipt } from 'src/app/models/entities/file.entity';

declare function doPrintJob(url: string): any;

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.css']
})
export class PrinterComponent extends BaseComponent {

  Title = '';
  NavigateClass = '';

  constructor(private router: Router, protected activatedRoute: ActivatedRoute, private receiptService: ReceiptService) {
    super(activatedRoute);
  }

  protected Init() {
    setTimeout(() => {
      html2canvas(document.getElementById('receipt-form')).then((canvas) => {

        canvas.toBlob((blob => {

          const receipt = new Receipt();
          receipt.OrderId = '222222323232323';
          receipt.CustomerId = 'fdfdhffudshfussd';
          receipt.Name = 'receipt1.png';

          console.log(blob);

          this.receiptService.uploadReceipt(blob, receipt, (url => {
            doPrintJob(url);
          }));

        }), 'image/png', 1);

      });
    }, 1000);
  }

}
