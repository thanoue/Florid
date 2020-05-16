import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionsService } from 'src/app/services/common/functions.service';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { MenuItems } from 'src/app/models/enums';
import { Tag } from 'src/app/models/entities/tag.entity';
import { TagService } from 'src/app/services/tag.service';
import { ProductCategoryService } from 'src/app/services/product.categpory.service';
import { ProductCategory } from 'src/app/models/entities/product.category.entity';
import { Guid } from 'guid-typescript';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {

  protected PageCompnent = new PageComponent('Trang chủ', MenuItems.Home);

  constructor(private router: Router, protected activatedRoute: ActivatedRoute, private productService: ProductService) {
    super();
  }

  protected Init() {
  }

  updateProductImg() {

    this.startLoading();
    this.productService.getAll()
      .then(products => {

        var updates = {};

        products.forEach(product => {

          updates[`/${product.Id}/ImageUrl`] = 'http://florid.com.vn/' + product.ImageUrl;

        });

        this.productService.updateList(updates, () => {
          this.stopLoading();
        });
      });
  }

  // initCate() {
  //   var proucts: ProductCategory[] = [];

  //   const pro1 = new ProductCategory();
  //   pro1.Index = ProductCategories.All;
  //   pro1.Id = Guid.create().toString();
  //   pro1.Name = "Tất cả";
  //   proucts.push(pro1);


  //   const pro2 = new ProductCategory();
  //   pro2.Index = ProductCategories.Valentine;
  //   pro2.Id = Guid.create().toString();
  //   pro2.Name = "Valentine";
  //   proucts.push(pro2);

  //   const pro3 = new ProductCategory();
  //   pro3.Index = ProductCategories.BoHoaTuoi;
  //   pro3.Id = Guid.create().toString();
  //   pro3.Name = "Bó hoa tươi";
  //   proucts.push(pro3);


  //   const pro4 = new ProductCategory();
  //   pro4.Index = ProductCategories.BinhHoaTuoi;
  //   pro4.Id = Guid.create().toString();
  //   pro4.Name = "Bình hoa tươi";
  //   proucts.push(pro4);


  //   const pro5 = new ProductCategory();
  //   pro5.Index = ProductCategories.HopHoaTuoi;
  //   pro5.Id = Guid.create().toString();
  //   pro5.Name = "Hộp hoa tươi";
  //   proucts.push(pro5);


  //   const pro6 = new ProductCategory();
  //   pro6.Index = ProductCategories.GioHoaTuoi;
  //   pro6.Id = Guid.create().toString();
  //   pro6.Name = "Giỏ hoa tươi";
  //   proucts.push(pro6);

  //   const pro7 = new ProductCategory();
  //   pro7.Index = ProductCategories.HoaCuoi;
  //   pro7.Id = Guid.create().toString();
  //   pro7.Name = "Hoa cưới";
  //   proucts.push(pro7);


  //   const pro8 = new ProductCategory();
  //   pro8.Index = ProductCategories.HoaNgheThuat;
  //   pro8.Id = Guid.create().toString();
  //   pro8.Name = "Hoa nghệ thuật";
  //   proucts.push(pro8);



  //   const pro9 = new ProductCategory();
  //   pro9.Index = ProductCategories.KeHoaTuoi;
  //   pro9.Id = Guid.create().toString();
  //   pro9.Name = "Kệ hoa tươi";
  //   proucts.push(pro9);


  //   const pro10 = new ProductCategory();
  //   pro10.Index = ProductCategories.HoaSuKien;
  //   pro10.Id = Guid.create().toString();
  //   pro10.Name = "Hoa sự kiện";
  //   proucts.push(pro10);

  //   const pro11 = new ProductCategory();
  //   pro11.Index = ProductCategories.LanHoDiep;
  //   pro11.Id = Guid.create().toString();
  //   pro11.Name = "Lan hồ điệp";
  //   proucts.push(pro11);

  //   this.startLoading();
  //   this.productCategoryService.setList(proucts).then(() => {
  //     this.stopLoading();
  //   });

  // }

  logout() {

    this.authService.loutOutFirebase(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['login']);
      }

    });
  }

  goToPrintJob() {
  }

  async getUsers() {
    try {
      this.startLoading();
      const users = await FunctionsService.excuteFunction('getUsers');
      console.log(users);
      this.stopLoading();
    } catch (error) {
      this.showWarning(error);
    }
  }
}
