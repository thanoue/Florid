import { Component, OnInit } from '@angular/core';
import { GenericModel } from './models/generic.model';
import { Subscribable, Subscription } from 'rxjs';
import { GlobalService } from './services/common/global.service';
import { strict } from 'assert';

// declare function showToast(title, message, okBtntext, okCallback?: () => void): any;
declare function insertData(data: GenericModel): number;
declare function insertDataWithIdResult(data: GenericModel): string;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  description = 'Customer list';

  constructor(private globalService: GlobalService) { }

  insertDataSubc: Subscription;
  insertDataWithIdResSubc: Subscription;

  ngOnInit(): void {

    this.insertDataSubc = this.globalService.insertDataCallback
      .subscribe(data => {

        if (!data || data == null) {
          return;

        }
        this.insertData(data);

      });

    this.insertDataWithIdResSubc = this.globalService.insertDataWithIdResCallback
      .subscribe(data => {

        if (!data || data == null) {
          return;

        }
        this.insertDataWithIdResult(data);

      });
  }

  public insertDataWithIdResult(data: GenericModel) {
    const insertRes = insertDataWithIdResult(data);
    console.log(insertRes);
    this.description = insertRes;
  }

  public insertData(data: GenericModel) {
    const insertRes = insertData(data);
    if (insertRes === -1) {
      console.log('not in mobile', data);
    }
  }
}
