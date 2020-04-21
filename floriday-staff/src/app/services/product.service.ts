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
