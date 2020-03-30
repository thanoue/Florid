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

}
