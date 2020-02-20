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

    async insertList(data: Product[]): Promise<Product[]> {

        console.log(data.length);

        const products: Product[] = [];

        for (let i = 1; i < data.length; i++) {
            console.log('insert', data[i]);

            const newData = await this.insert(data[i]);


            if (newData) {
                products.push(newData);
                console.log(data[i]);
                continue;
            } else {
                console.log('error');
                continue;
            }
        }

        return products;
    }
}
