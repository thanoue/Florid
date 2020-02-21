import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';

import { from } from 'rxjs';
import { promise } from 'protractor';

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
