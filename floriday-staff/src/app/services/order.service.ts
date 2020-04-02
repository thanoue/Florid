import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import { Order } from '../models/entities/order.entity';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService<Order> {

  protected tableName = '/orders';

  constructor() {
    super()
  }


  getNextIndex(): Promise<number> {

    return this.tableRef.limitToLast(1).once('value').then(snapShot => {

      if (!snapShot.val()) {

        const newOrder = new Order();
        newOrder.Id = `DON_1`;

        this.db.ref(`${this.tableName}/${newOrder.Id}`).set(newOrder).then(() => {
          return 1;
        });

      }

      let key = '';

      snapShot.forEach(child => {
        key = child.key;
      });

      let index = +key.substring(4);
      index += 1;

      console.log(index);

      const newOrder = new Order();
      newOrder.Id = `DON_${index}`;

      return this.db.ref(`${this.tableName}/${newOrder.Id}`).set(newOrder).then(res => {
        return index;
      });

    }).catch(() => {

      return 1;

    });
  }
}
