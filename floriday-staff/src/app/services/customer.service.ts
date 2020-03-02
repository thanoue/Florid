import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BaseModel } from '../models/base.model';
import { Customer } from '../models/customer';
import { BaseService } from './common/base.service';
import 'firebase/database';

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