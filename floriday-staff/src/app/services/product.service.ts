import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';

import { from } from 'rxjs';
import { promise } from 'protractor';
import 'firebase/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from '../models/entities/product.entity';
import { ProductCategories } from '../models/enums';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseService<Product> {

    protected tablePath(): string {
        return 'products';
    }

    constructor() {
        super();
    }

    getAllByCategory(category: number): Promise<Product[]> {

        this.globalService.startLoading();

        return this.db.ref(this.tablePath()).orderByChild('ProductCategories').equalTo(category).once('value').then(snapshot => {

            const res: Product[] = [];
            snapshot.forEach(data => {
                res.push(data.val() as Product);
            });

            res.forEach(product => {
                product.ImageUrl = 'http://florid.com.vn/' + product.ImageUrl;
            });

            this.globalService.stopLoading();
            return res;

        });

    }
}
