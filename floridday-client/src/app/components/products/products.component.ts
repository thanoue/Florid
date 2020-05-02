import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends BaseComponent {
  protected PageCompnent: PageComponent = new PageComponent('Danh sách sản phẩm', MenuItems.Product);

  pageCount = 3;

  protected Init() {
  }

  constructor() {
    super();
  }

  pageChanged(event) {

  }


}
