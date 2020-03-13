import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategories } from 'src/app/models/enums';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import { max } from 'rxjs/operators';
import { PRODUCTCATEGORIES } from 'src/app/app.constants';

declare function selectProductCategory(menuitems: { Name: string; Value: ProductCategories; }[], callback: (index: number) => void): any;


@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent extends BaseComponent {

  Title = 'Chọn sản phẩm';
  detailIndex: string;
  productCategory: ProductCategories;
  currentPage = 1;
  currentMaxPage = 0;

  pagingProducts: Product[];
  globalProducts: Product[];

  categoryName = '';
  selectedProduct: Product;

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService, private _ngZone: NgZone) {
    super();

    this.pagingProducts = [];
    this.globalProducts = [];

  }


  protected Init() {

    this.route.queryParams
      .subscribe(params => {

        this.detailIndex = params.orderDetailId;

        this.getProductByCategory(+params.category);
      });

    const key = 'selectItemReference';

    window[key] = {
      component: this, zone: this._ngZone,
      itemSelected: (data) => this.setSelectedProduct(data)
    };

  }

  setSelectedProduct(data: string) {
    this.selectedProduct = this.pagingProducts.find(p => p.Id === data);
  }


  getProductByCategory(category: number) {

    this.productCategory = category;

    this.categoryName = PRODUCTCATEGORIES.filter(p => p.Value === this.productCategory)[0].Name;

    this.currentMaxPage = 0;
    this.currentPage = 0;

    this.productService.getAllByCategory(category).then(res => {

      this.globalProducts = [];
      this.pagingProducts = [];

      this.globalProducts = res as Product[];

      this.currentMaxPage = Math.max.apply(Math, this.globalProducts.map(function (o) { return o.Page; }));

      this.getProductsByPage(1);

      this.selectedProduct = new Product();


    });
  }

  filter() {
    selectProductCategory(PRODUCTCATEGORIES, (val) => {
      console.log(val);
      this.getProductByCategory(val);
    });
  }

  getProductsByPage(page: number) {

    if (page <= 0) {
      return;
    }

    if (this.currentMaxPage < page) {
      return;
    }

    this.pagingProducts = this.globalProducts.filter(p => p.Page === page);

    this.currentPage = page;

    this.selectedProduct = new Product();

  }

  selectProduct() {
    if (!this.selectedProduct.Id) {
      this.globalService.showMessageDialog("Lưu ý!", "Chưa có sản phẩm nào được chọn !");
    }
  }
}
