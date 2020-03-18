import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderViewModel } from 'src/app/models/view.models/order.model';

@Component({
  selector: 'app-sale-option',
  templateUrl: './sale-option.component.html',
  styleUrls: ['./sale-option.component.css']
})
export class SaleOptionComponent extends BaseComponent {

  Title = 'Thanh toán';
  protected IsDataLosingWarning = false;
  order: OrderViewModel;

  protected Init() {
    this.order = this.currentGlobalOrder;
  }


}
