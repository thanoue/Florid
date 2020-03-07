import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';

import { from } from 'rxjs';
import { promise } from 'protractor';
import 'firebase/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from '../models/entities/product.entity';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseService<Product> {

    protected tablePath(): string {
        return '/products';
    }

    constructor() {
        super();
    }
}
