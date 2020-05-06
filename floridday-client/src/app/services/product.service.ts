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

    getCategoryCount(category: ProductCategories): Promise<number> {
        if (category === ProductCategories.All) {
            return this.tableRef.orderByChild('Index').limitToLast(1).once('value')
                .then(snapshot => {

                    let product: Product;
                    snapshot.forEach(snap => {
                        product = snap.val() as Product;
                    });

                    return product.Index;
                })
                .catch(error => {
                    this.errorToast(error);
                    return 0;
                });
        }
        return this.tableRef.orderByChild('CategoryIndex')
            .startAt(1 + category * 10000)
            .endAt(9999 + category * 10000)
            .limitToLast(1).once('value')
            .then(snapshot => {

                let product: Product;
                snapshot.forEach(snap => {
                    product = snap.val() as Product;
                });

                return product.CategoryIndex % 10000;
            })
            .catch(error => {
                this.errorToast(error);
                return 0;
            });
    }

    getByPage(page: number, itemsPerPage: number, category?: ProductCategories): Promise<Product[]> {

        this.startLoading();

        let query: Promise<firebase.database.DataSnapshot>;

        if (category === undefined || category === null || category === ProductCategories.All) {
            query = this.tableRef.orderByChild('Index')
                .startAt((page - 1) * itemsPerPage + 1)
                .endAt(itemsPerPage * page)
                .once('value');

        } else {
            query = this.tableRef.orderByChild('CategoryIndex')
                .startAt((page - 1) * itemsPerPage + 1 + category * 10000)
                .endAt(itemsPerPage * page + category * 10000)
                .once('value');
        }

        return query
            .then(snapshot => {
                this.stopLoading();
                const products = [];
                snapshot.forEach(snap => {
                    const product = snap.val() as Product;
                    product.ImageUrl = 'http://florid.com.vn/' + product.ImageUrl;
                    products.push(product);
                });
                return products;
            })
            .catch(error => {
                this.stopLoading();
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
