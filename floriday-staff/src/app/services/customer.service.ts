import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
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
}