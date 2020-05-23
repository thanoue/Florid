import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';

import { from, of } from 'rxjs';
import { promise } from 'protractor';
import 'firebase/database';
import { Product } from '../models/entities/product.entity';
import { async } from '@angular/core/testing';
import { constants } from 'crypto';
import { GlobalService } from './common/global.service';
import { ProductImage } from '../models/entities/file.entity';
import { StorageService } from './storage.service';

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

    getCategoryCount(category: number): Promise<number> {
        if (category === -1) {
            return this.getCount();
        } else {
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
                    this.warningToast('Không tìm thấy sản phẩm nào');
                    return 0;
                });
        }
    }

    getlastCategoryIndex(category: number): Promise<number> {

        if (category == -1) {
            return this.getCount();
        }
        else return this.getCategoryCount(category)
            .then(count => {
                return count + 10000 * category;
            });
    }

    getByCategoryIndex(index: number): Promise<Product> {
        return this.tableRef.orderByChild('CategoryIndex').equalTo(index)
            .once('value')
            .then(snapshot => {

                let product: Product = null;
                snapshot.forEach(snap => {
                    product = snap.val() as Product;
                });

                return product;

            });
    }

    getByPage(page: number, itemsPerPage: number, category?: number): Promise<Product[]> {

        this.startLoading();

        let query: Promise<firebase.database.DataSnapshot>;

        if (category === undefined || category === null || category === -1) {
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
