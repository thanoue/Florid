import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { OrderDetail } from '../models/entities/order.entity';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService extends BaseService<OrderDetail>  {

  protected tableName = '/orderDetails';

  constructor() {
    super();
  }

  getHardcodeImageSavedCounting(name: string, callback: (count: number) => void): void {

    if (!name || name === '') {
      callback(0);
      return;
    }

    this.globalService.startLoading();
    this.tableRef.orderByChild('HardcodeProductImageName').equalTo(name).once('value').then(snapshot => {

      this.globalService.stopLoading();

      if (snapshot) {
        callback(snapshot.numChildren());
      } else {
        callback(0);
      }

    });
  }

}
