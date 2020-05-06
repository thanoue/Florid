import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems, ProductCategories } from 'src/app/models/enums';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import { PRODUCTCATEGORIES } from 'src/app/app.constants';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends BaseComponent {
  protected PageCompnent: PageComponent = new PageComponent('Danh sách sản phẩm', MenuItems.Product);

  pageCount = 0;
  itemTotalCount = 0;

  products: Product[];

  _selectedCategory: ProductCategories;

  get selectedCategory(): ProductCategories {
    return this._selectedCategory;
  }

  set selectedCategory(val: ProductCategories) {
    this._selectedCategory = val;
    this.categoryChange();
  }

  _itemsPerPage: number;

  get itemPerpage(): number {
    return this._itemsPerPage;
  }

  set itemPerpage(val: number) {
    this._itemsPerPage = val;
    this.categoryChange();
  }

  categories: {
    Name: string,
    Value: ProductCategories
  }[];

  protected Init() {

    this.products = [];

    this._selectedCategory = ProductCategories.All;
    this._itemsPerPage = 10;

    this.categories = PRODUCTCATEGORIES;

    this.categoryChange();

  }

  constructor(private productService: ProductService) {
    super();
  }

  categoryChange() {

    this.productService.getCategoryCount(this._selectedCategory).then(count => {

      this.itemTotalCount = count;

      this.pageCount = count % this._itemsPerPage === 0 ? count / this._itemsPerPage : Math.floor(count / this._itemsPerPage) + 1;

      console.log('page count:', this.pageCount);

      this.productService.getByPage(1, this._itemsPerPage, this._selectedCategory)
        .then(products => {
          this.products = products;
        });

    });

  }

  pageChanged(page) {

    this.productService.getByPage(page, this._itemsPerPage, this._selectedCategory)
      .then(products => {
        this.products = products;
      });

  }

}
