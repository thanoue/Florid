import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategories } from 'src/app/models/enums';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import { max } from 'rxjs/operators';
import { PRODUCTCATEGORIES } from 'src/app/app.constants';
import { ExchangeService } from 'src/app/services/exchange.service';

declare function selectProductCategory(menuitems: { Name: string; Value: ProductCategories; }[], callback: (index: number) => void): any;
declare function filterFocus(): any;

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent extends BaseComponent {

  Title = 'Chọn sản phẩm';
  detailIndex: number;
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

    this.selectedProduct = new Product();

    this.route.queryParams
      .subscribe(params => {

        this.detailIndex = +params.orderDetailId;

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

    });
  }

  filter() {
    selectProductCategory(PRODUCTCATEGORIES, (val) => {
      filterFocus();
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
      this.showError('Chưa có sản phẩm nào được chọn!!');
      return;
    }

    this.currentGlobalOrder.OrderDetails[this.detailIndex].ProductName = this.selectedProduct.Name;
    this.currentGlobalOrder.OrderDetails[this.detailIndex].ProductImageUrl = this.selectedProduct.ImageUrl;
    this.currentGlobalOrder.OrderDetails[this.detailIndex].ProductId = this.selectedProduct.Id;

    const price = ExchangeService.stringPriceToNumber(this.selectedProduct.Price);

    this.currentGlobalOrder.OrderDetails[this.detailIndex].OriginalPrice = price;
    this.currentGlobalOrder.OrderDetails[this.detailIndex].ModifiedPrice = price;

    this.OnNavigateClick();
  }
}
