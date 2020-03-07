import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BaseService } from './common/base.service';
import { Customer } from '../models/entities/customer.entity';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<Customer> {

  protected tablePath(): string {
    return '/customers';
  }

  constructor() {
    super();

  }

}