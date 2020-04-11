import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategories } from 'src/app/models/enums';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import { max } from 'rxjs/operators';
import { PRODUCTCATEGORIES } from 'src/app/app.constants';
import { ExchangeService } from 'src/app/services/exchange.service';
import { TempProduct } from 'src/app/models/entities/file.entity';
import { TempProductService } from 'src/app/services/tempProduct.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';

declare function selectProductCategory(menuitems: { Name: string; Value: ProductCategories; }[], callback: (index: any) => void): any;
declare function filterFocus(): any;

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.css']
})
export class SearchProductComponent extends BaseComponent {

  Title = 'Chọn sản phẩm';
  productCategory: ProductCategories;
  currentPage = 1;
  currentMaxPage = 0;

  pagingProducts: Product[];
  globalProducts: Product[];

  categoryName = '';
  selectedProduct: Product;
  currentHardcodeUsedCount = -1;

  protected IsDataLosingWarning = false;

  constructor(private route: ActivatedRoute, private router: Router, private orderDetailService: OrderDetailService,
    private productService: ProductService, private _ngZone: NgZone, private tempProductService: TempProductService) {
    super();

    this.pagingProducts = [];
    this.globalProducts = [];

  }

  protected async Init() {

    this.selectedProduct = new Product();

    this.route.queryParams
      .subscribe(params => {

        this.getProductByCategory(+params.category);

      });

    const key = 'selectItemReference';

    window[key] = {
      component: this, zone: this._ngZone,
      itemSelected: (data) => this.setSelectedProduct(data)
    };

    this.orderDetailService.getHardcodeImageSavedCounting(this.globalOrderDetail.HardcodeImageName, (count) => {

      this.currentHardcodeUsedCount = count;

      if (this.currentHardcodeUsedCount === 1) {
        this.currentHardcodeUsedCount = 0;
      }

      this.globalOrder.OrderDetails.forEach(detail => {
        if (detail.HardcodeImageName === this.globalOrderDetail.HardcodeImageName) {
          this.currentHardcodeUsedCount++;
        }
      });

    });

  }


  onChange(event) {
    const filesUpload: File = event.target.files[0];

    this.globalOrderDetail.IsFromHardCodeProduct = true;
    this.globalOrderDetail.OriginalPrice = 0;
    this.globalOrderDetail.ModifiedPrice = 0;
    this.globalOrderDetail.ProductName = '.....';

    const newName = `temp_image_${(new Date().getTime().toString())}`;

    const tempProduct = new TempProduct();
    tempProduct.Name = newName;

    this.startLoading();

    if (this.globalOrderDetail.HardcodeImageName && this.currentHardcodeUsedCount === 1) {

      this.tempProductService.deleteFile(this.globalOrderDetail.HardcodeImageName)
        .then(() => {

          this.tempProductService.addFile(filesUpload, tempProduct, (url) => {

            this.stopLoading();

            if (url === 'ERROR') {
              this.showError('Upload hình lỗi!!');
              return;
            }

            this.globalOrderDetail.ProductImageUrl = url;
            this.globalOrderDetail.HardcodeImageName = tempProduct.Name;

            this.OnBackNaviage();
          });

        })
        .catch(error => {
          this.stopLoading();
          console.log(error);
          return;
        });

    } else {

      this.tempProductService.addFile(filesUpload, tempProduct, (url) => {

        this.stopLoading();

        if (url === 'ERROR') {
          this.showError('Upload hình lỗi!!');
          return;
        }

        this.globalOrderDetail.ProductImageUrl = url;
        this.globalOrderDetail.HardcodeImageName = tempProduct.Name;

        this.OnBackNaviage();

      });

    }
  }

  protected fileChosen(path: string) {

    this.globalOrderDetail.IsFromHardCodeProduct = true;
    this.globalOrderDetail.ProductImageUrl = 'data:image/png;base64,' + path;
    this.globalOrderDetail.OriginalPrice = 0;
    this.globalOrderDetail.ModifiedPrice = 0;
    this.globalOrderDetail.ProductName = '.....';

    const newName = `temp_image_${(new Date().getTime().toString())}`;

    const tempProduct = new TempProduct();
    tempProduct.Name = newName;

    this.startLoading();

    if (this.globalOrderDetail.HardcodeImageName && this.currentHardcodeUsedCount === 1) {

      this.tempProductService.deleteFile(this.globalOrderDetail.HardcodeImageName)
        .then(() => {

          this.tempProductService.addFileFromBase64String(this.globalOrderDetail.ProductImageUrl, tempProduct, (url) => {

            this.stopLoading();

            if (url === 'ERROR') {
              this.showError('Upload hình lỗi!!');
              return;
            }

            this.globalOrderDetail.ProductImageUrl = url;
            this.globalOrderDetail.HardcodeImageName = tempProduct.Name;

            this.OnBackNaviage();
          });

        })
        .catch(error => {
          this.stopLoading();
          console.log(error);
          return;
        });

    } else {

      this.tempProductService.addFileFromBase64String(this.globalOrderDetail.ProductImageUrl, tempProduct, (url) => {

        this.stopLoading();

        if (url === 'ERROR') {
          this.showError('Upload hình lỗi!!');
          return;
        }

        this.globalOrderDetail.ProductImageUrl = url;
        this.globalOrderDetail.HardcodeImageName = tempProduct.Name;

        this.OnBackNaviage();

      });

    }
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
      this.getProductByCategory(+val);
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

    this.globalOrderDetail.ProductName = this.selectedProduct.Name;
    this.globalOrderDetail.ProductImageUrl = this.selectedProduct.ImageUrl;
    this.globalOrderDetail.ProductId = this.selectedProduct.Id;
    this.globalOrderDetail.IsFromHardCodeProduct = false;

    const price = ExchangeService.stringPriceToNumber(this.selectedProduct.Price);

    this.globalOrderDetail.OriginalPrice = price;
    this.globalOrderDetail.ModifiedPrice = price;

    if (this.globalOrderDetail.HardcodeImageName && this.currentHardcodeUsedCount === 1) {

      this.startLoading();

      this.tempProductService.deleteFile(this.globalOrderDetail.HardcodeImageName)
        .then(res => {

          this.stopLoading();

          this.globalOrderDetail.HardcodeImageName = '';

          this.OnBackNaviage();

        })
        .catch(error => {

          console.log(error);

          this.OnBackNaviage();

        });

    } else {

      this.OnBackNaviage();

    }

  }
}
