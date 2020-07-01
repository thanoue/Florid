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

    searchProduct(term: string): Promise<any> {
        return this.tableRef
            .orderByChild('Name')
            .startAt(term)
            .endAt(term + '\uf8ff')
            .once('value')
            .then((res: any) => {

                const customers: any[] = [];

                res.forEach((snapShot: any) => {
                    customers.push(snapShot.val());
                });

                return customers;
            });
    }

    updateCategoryIndex(startIndex: number, delta: number): Promise<number> {

        const offset = startIndex - (startIndex % 10000);

        console.log(offset, startIndex, delta);

        return this.tableRef.orderByChild('CategoryIndex')
            .startAt(startIndex)
            .endAt(9999 + offset).once('value')
            .then(async (snapshot: any) => {

                try {

                    const products: any[] = [];

                    if (snapshot) {

                        snapshot.forEach((snap: any) => {
                            let product = snap.val();
                            products.push(product);
                        });
                    }

                    console.log('category index updateing count:', products.length);

                    if (products.length <= 0) {

                        return this.tableRef.orderByChild('CategoryIndex')
                            .startAt(1 + offset + 10000)
                            .endAt(2 + offset + 10000)
                            .limitToFirst(1)
                            .once('value')
                            .then((snapshot: any) => {

                                let newProds: any;

                                snapshot.forEach((snap: any) => {
                                    let product = snap.val();
                                    newProds = product;
                                });

                                if (!newProds || newProds == undefined || newProds == null)
                                    return 0;

                                return newProds.Index;

                            });
                    }

                    interface IDictionary {
                        [index: string]: number;
                    }

                    var updates = {} as IDictionary;

                    products.forEach((product: any) => {
                        updates[`/${product.Id}/CategoryIndex`] = product.CategoryIndex + delta;
                    });

                    await this.tableRef.update(updates);

                    return products[0].Index;
                }
                catch (error) {
                    throw error;
                }

            });
    }

    updateProductIndexMultiple(smallestIndex: number, smallestCateIndexes: number[]): Promise<any> {

        let startIndex = smallestIndex + 1;

        console.log(smallestIndex, smallestCateIndexes);

        return this.tableRef.orderByChild('Index')
            .startAt(startIndex)
            .once('value')
            .then(async (snapshot: any) => {
                if (snapshot) {

                    const globalProducts: any[] = [];

                    snapshot.forEach((snap: any) => {
                        let product = snap.val();
                        globalProducts.push(product);
                    });

                    interface IDictionary {
                        [index: string]: number;
                    }

                    var updates = {} as IDictionary;

                    globalProducts.forEach((product: any) => {
                        updates[`/${product.Id}/Index`] = startIndex;
                        startIndex++;
                    });

                    smallestCateIndexes.forEach((categoryIndex: number) => {

                        let startCateIndex = categoryIndex += 1;

                        const offset = categoryIndex - (categoryIndex % 10000);
                        const cateUpdates: any[] = [];

                        globalProducts.forEach(product => {

                            if (product.CategoryIndex >= startCateIndex && product.CategoryIndex <= (9999 + offset)) {
                                cateUpdates.push(product);
                            }

                        });

                        cateUpdates.forEach(product => {

                            updates[`/${product.Id}/CategoryIndex`] = startCateIndex;
                            startCateIndex += 1;

                        });

                    });

                    return await this.tableRef.update(updates);

                } else {
                    return;
                }
            })
    }


    updateIndex(startIndex: number, delta: number): Promise<any> {

        console.log('start index:', startIndex);

        return this.tableRef.orderByChild('Index')
            .startAt(startIndex).once('value')
            .then((snapshot: any) => {

                try {
                    const products: any[] = [];

                    if (snapshot) {
                        snapshot.forEach((snap: any) => {
                            const product = snap.val();
                            products.push(product);
                        });
                    }

                    if (products.length <= 0) {
                        return;
                    }

                    console.log('index updating count:', products.length);


                    interface IDictionary {
                        [index: string]: number;
                    }

                    var updates = {} as IDictionary;

                    products.forEach((product: any) => {
                        updates[`/${product.Id}/Index`] = product.Index + delta;
                    });

                    return this.tableRef.update(updates);
                }
                catch (error) {
                    throw error;
                }

            });
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
            return products;
        });
    }
}
