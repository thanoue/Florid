import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService<Customer> {

  protected tableName = '/orders';

  constructor() {
    super()
  }

  getNextIndex(): Promise<number> {
    return this.tableRef.limitToLast(1).once('value').then(snapShot => {

      if (!snapShot.val()) {
        return 1;
      }

      let key = snapShot.key;

      let lastIndex = +key.substring(4, key.length);

      return lastIndex++;

    }).catch(() => {
      return 1;
    });
  }
}
