import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';

import { from, of } from 'rxjs';
import { promise } from 'protractor';
import 'firebase/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from '../models/entities/product.entity';
import { ProductCategories } from '../models/enums';
import { async } from '@angular/core/testing';
import { constants } from 'crypto';
import { GlobalService } from './common/global.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends BaseService<Product> {

    protected tableName = '/products';

    constructor() {
        super();
    }

    getCount(): Promise<number> {
        return this.tableRef.orderByChild('Index').limitToLast(1).once('value')
            .then(snapshot => {
                return (snapshot.val() as Product).Index;
            })
            .catch(error => {
                this.errorToast(error);
                return 0;
            });
    }

    getCategoryCount(category: ProductCategories): Promise<number> {

        return this.tableRef.orderByChild('CategoryIndex')
            .startAt(1 + category * 10000)
            .endAt(9999 + category * 10000)
            .limitToLast(1).once('value')
            .then(snapshot => {
                return (snapshot.val() as Product).CategoryIndex % 10000;
            })
            .catch(error => {
                this.errorToast(error);
                return 0;
            });
    }

    getByPage(page: number, itemCount: number, category?: ProductCategories): Promise<Product[]> {

        let query: Promise<firebase.database.DataSnapshot>;

        if (category === undefined || category === null) {
            query = this.tableRef.orderByChild('Index')
                .startAt((page - 1) * itemCount + 1)
                .endAt(itemCount * page)
                .once('value');

        } else {
            console.log(category);
            query = this.tableRef.orderByChild('CategoryIndex')
                .startAt((page - 1) * itemCount + 1 + category * 10000)
                .endAt(itemCount * page + category * 10000)
                .once('value');
        }

        return query
            .then(snapshot => {
                const products = [];
                snapshot.forEach(snap => {
                    products.push(snap.val() as Product);
                });
                return products;
            })
            .catch(error => {
                this.errorToast(error);
                return [];
            });
    }

    getAllByCategory(category: number): Promise<Product[]> {

        return this.getByFieldName('ProductCategories', category).then(products => {

            products.forEach(product => {
                product.ImageUrl = 'http://florid.com.vn/' + product.ImageUrl;

            });

            return products;
        });
    }
}
