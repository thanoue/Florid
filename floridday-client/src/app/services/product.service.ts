import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';

import { from, of } from 'rxjs';
import { promise } from 'protractor';
import 'firebase/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product, Products } from '../models/entities/product.entity';
import { ProductCategories } from '../models/enums';
import { async } from '@angular/core/testing';
import { constants } from 'crypto';
import { GlobalService } from './common/global.service';

declare function getProductsFromCache(category: number): any;
declare function addProductsToCache(products: Product[]): any;

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
                    products.push(snapshot.val() as Product);
                });
                return products;
            })
            .catch(error => {
                this.errorToast(error);
                return [];
            });
    }

    getProductsFromCache(category): any {

        if (this.globalService.isRunOnTerimal()) {

            return getProductsFromCache(category);

        } else {

            const products = this.globalService.cacheProducts.filter(p => p.ProductCategories === category);

            if (!products || products.length <= 0) {
                return 'NONE';
            }

            return products;
        }
    }

    addProductsToCache(products: Product[]) {
        if (this.globalService.isRunOnTerimal()) {
            addProductsToCache(products);
        } else {
            this.globalService.cacheProducts = this.globalService.cacheProducts.concat(products);
        }
    }

    getAllByCategory(category: number): Promise<Product[]> {


        const productFromCache = this.getProductsFromCache(category);

        if (productFromCache === 'NONE') {

            return this.getByFieldName('ProductCategories', category).then(products => {

                products.forEach(product => {
                    product.ImageUrl = 'http://florid.com.vn/' + product.ImageUrl;

                });

                this.addProductsToCache(products);

                return products;
            });
        } else {

            return new Promise<Product[]>((resolve, reject) => {
                try {
                    if (typeof productFromCache === 'string') {
                        resolve(JSON.parse(productFromCache) as Product[]);
                    } else {
                        resolve(productFromCache as Product[]);
                    }
                } catch (exep) {
                    reject(exep);
                }

            }).then(res => {
                return res;
            }).catch(exep => {
                this.globalService.showError(exep);
                return [];
            });
        }
    }
}
