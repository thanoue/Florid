import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends BaseComponent {
  protected PageCompnent: PageComponent = new PageComponent('Danh sách sản phẩm', MenuItems.Product);

  pageCount = 0;
  itemsPerPage = 10;
  itemTotalCount = 0;

  products: Product[];

  protected Init() {

    this.products = [];

    this.productService.getCount().then(count => {

      console.log(count);
      this.itemTotalCount = count;
      this.pageCount = count % this.itemsPerPage === 0 ? count / this.itemsPerPage : count / this.itemsPerPage + 1;

      this.productService.getByPage(1, this.itemsPerPage)
        .then(products => {
          this.products = products;
        });

    });

  }

  constructor(private productService: ProductService) {
    super();
  }

  pageChanged(page) {
    this.productService.getByPage(page, this.itemsPerPage)
      .then(products => {
        this.products = products;
      });

  }

}
