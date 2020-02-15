import { Component, OnInit, NgZone } from '@angular/core';
import { CustomerService } from 'src/app/services/customer.service';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseComponent } from '../base.component';
import { GenericModel } from 'src/app/models/generic.model';
import { EntityType, Roles } from 'src/app/models/enums';
import { User, LoginModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

declare function showAndroidToast(toast: string): any;
declare function callAngularFunction(data: string): any;

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list-template.html',
  styleUrls: ['./customers-list-style.css']
})
export class CustomersListComponent extends BaseComponent {
  users: any;
  contentCallback = 'Init';
  // tslint:disable-next-line:max-line-length
  //base64String = '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';
  imagePath: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer,
    private customerService: CustomerService,
    private ngZone: NgZone,
    private userService: UserService) {
    super();
  }


  protected Init() {

    const key = 'angularComponentReference';

    window[key] = {
      component: this, zone: this.ngZone,
      loadAngularFunction: (data) => this.angularFunctionCalled(data)
    };
    this.getCustomersList();

    // setTimeout(() => {
    //   this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
    //     + this.base64String);
    // }, 1000);
  }

  getCustomersList() {
    this.userService.getAll().subscribe(users => {
      this.users = users;
    });
  }

  angularFunctionCalled(data: string) {
    this.contentCallback = data;
  }

  addUser() {
    const model = new GenericModel();

    model.ModelType = EntityType.User;

    const user = new User();
    user.AvtUrl = 'https://google.com';
    user.FullName = 'Tran Vinh Kha';
    user.PhoneNumber = '02937272';
    user.Role = Roles.Florist;
    user.LoginModel = new LoginModel('khoikha@gmail.com', '09322');

    model.Data = user;

    this.userService.insert(user).then(res => {
      this.userService.getById(res.Id).subscribe(newUser => {
        console.log(newUser);
      });

      // this.insertData(model);
      // this.insertDataWithIdResult(model);
      // showAndroidToast('set listener');

      // callAngularFunction('from angular');
      //  this.customerService.deleteAll().catch(err => console.log(err));
    });
  }
}
