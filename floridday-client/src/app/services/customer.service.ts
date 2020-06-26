import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import * as firebase from 'firebase';
import { CustomerReceiverDetail } from '../models/entities/order.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<Customer> {

  protected tableName = '/customers';

  constructor() {
    super();

  }

  public updateReceiverList(customerId: string, data: CustomerReceiverDetail[]): Promise<boolean> {
    return this.db.ref(`${this.tableName}/${customerId}/ReceiverInfos`).set(data).then(res => {
      return true;
    }).catch(error => {
      console.log(error);
      return false;
    });
  }


  getByPage(page: number, itemsPerPage: number): Promise<Customer[]> {

    this.startLoading();

    let query = this.tableRef.orderByChild('Index')
      .startAt((page - 1) * itemsPerPage + 1)
      .endAt(itemsPerPage * page)
      .once('value');

    return query.then(snapshot => {
      this.stopLoading();
      const Customers = [];
      snapshot.forEach(snap => {
        const Customer = snap.val() as Customer;

        Customers.push(Customer);
      });

      return Customers;

    }).catch(error => {
      this.stopLoading();
      this.errorToast(error);
      return [];
    })
  }

  getCount(): Promise<number> {
    this.startLoading();
    return this.tableRef.orderByChild('Index').limitToLast(1).once('value')
      .then(snapshot => {

        this.stopLoading();

        let customer: Customer;
        snapshot.forEach(snap => {
          customer = snap.val() as Customer;
        });

        if (!customer)
          return 0;

        return customer.Index;
      })
      .catch(error => {
        this.errorToast(error);
        return 0;
      });
  }

  updateIndex(deletedIndex: number): Promise<any> {

    return this.tableRef.orderByChild('Index')
      .startAt(deletedIndex + 1).once('value')
      .then((snapshot: any) => {

        try {
          const customers: Customer[] = [];

          snapshot.forEach((snap: any) => {
            const tag = snap.val() as Customer;
            if (tag.Index > deletedIndex) {
              customers.push(tag);
            }
          });

          interface IDictionary {
            [index: string]: number;
          }

          var updates = {} as IDictionary;

          customers.forEach((customer: any) => {

            updates[`/${customer.Id}/Index`] = deletedIndex;
            deletedIndex += 1;

          });

          return this.tableRef.update(updates);
        }
        catch (error) {
          throw error;
        }

      });
  }
}