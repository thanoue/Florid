import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BaseService } from './common/base.service';
import 'firebase/database';
import { Customer } from '../models/entities/customer.entity';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<Customer> {

  protected tablePath(): string {
    return '/customers';
  }

  constructor(db: AngularFireDatabase) {
    super(db);
  }
}