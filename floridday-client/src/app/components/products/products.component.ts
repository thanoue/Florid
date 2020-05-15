import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import { ProductCategoryService } from 'src/app/services/product.categpory.service';
import { MenuItems } from 'src/app/models/enums';
import { NgForm } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

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

  _selectedCategory: number;

  get selectedCategory(): number {
    return this._selectedCategory;
  }

  set selectedCategory(val: number) {
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
    Value: number
  }[];

  edittingCategories: {
    Name: string,
    Value: number
  }[];


  edittingProduct: Product;

  protected Init() {

    this.products = [];
    this._itemsPerPage = 10;
    this.categories = [];
    this.edittingCategories = [];
    this.edittingProduct = new Product();

    this.productCategoryService.getAllWithOrder('Index').then(categories => {

      categories.forEach(category => {

        this.categories.push({
          Name: category.Name,
          Value: category.Index
        });

        if (category.Index !== -1) {
          this.edittingCategories.push({
            Name: category.Name,
            Value: category.Index
          });
        }

      });

      this._selectedCategory = categories[0].Index;

      this.categoryChange();

    });
  }

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) {
    super();
  }

  categoryChange() {

    this.startLoading();
    this.productService.getCategoryCount(this._selectedCategory).then(count => {

      this.itemTotalCount = count;

      this.pageCount = count % this._itemsPerPage === 0 ? count / this._itemsPerPage : Math.floor(count / this._itemsPerPage) + 1;

      this.productService.getByPage(1, this._itemsPerPage, this._selectedCategory)
        .then(products => {
          this.products = products;
          this.stopLoading();
        });

    });

  }

  addProduct(form: NgForm) {

    if (!form.valid) {
      return;
    }

    console.log(this.edittingProduct);
  }

  pageChanged(page) {

    this.productService.getByPage(page, this._itemsPerPage, this._selectedCategory)
      .then(products => {
        this.products = products;
      });

  }

}
