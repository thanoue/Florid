import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-sort-order-changing',
  templateUrl: './sort-order-changing.component.html',
  styleUrls: ['./sort-order-changing.component.css']
})
export class SortOrderChangingComponent extends BaseComponent {

  Title = 'Thứ tự ưu tiên';
  protected IsDataLosingWarning = false;

  protected Init() {

  }

  constructor() {
    super();
  }

  ngOnInit(): void {

  }

}
