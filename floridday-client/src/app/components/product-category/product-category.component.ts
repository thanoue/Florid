import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';

@Component({
  selector: 'app-product-categories',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent extends BaseComponent {

  protected PageCompnent : PageComponent = new PageComponent('Danh mục sản phẩm', MenuItems.ProductCategory);

  protected Init() {

  }

  constructor() { 
    super();
  }


}
