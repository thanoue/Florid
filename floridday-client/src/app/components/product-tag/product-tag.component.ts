import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import {PageComponent} from "../../models/view.models/menu.model";
import { MenuItems } from 'src/app/models/enums';
@Component({
  selector: 'app-product-tag',
  templateUrl: './product-tag.component.html',
  styleUrls: ['./product-tag.component.css']
})
export class ProductTagComponent extends BaseComponent {

  protected PageCompnent: PageComponent =  new PageComponent('Tag Sản Phẩm',MenuItems.ProductTag);

  protected Init() {

  }

  constructor() { 
    super();
  }

}
