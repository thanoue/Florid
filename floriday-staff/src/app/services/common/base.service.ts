import { AppInjector } from './base.injector';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import * as firebase from 'firebase';
import { BaseEntity } from 'src/app/models/entities/base.entity';

export abstract class BaseService<T extends BaseEntity> {

    protected db: firebase.database.Database;

    protected globalService: GlobalService;

    protected abstract get tableName(): string;

    protected get tableRef(): firebase.database.Reference {
        return this.db.ref(this.tableName);
    }

    protected startLoading() {
        this.globalService.startLoading();
    }

    protected stopLoading() {
        this.globalService.stopLoading();
    }

    constructor() {
        const injector = AppInjector.getInjector();
        this.globalService = injector.get(GlobalService);
        this.db = firebase.database();
    }

    public set(model: T): Promise<T> {
        return this.db.ref(`${this.tableName}/${model.Id}`).set(model).then(res => {
            if (res) {
                return model;
            }
        });
    }

    public insert(model: T): Promise<T> {

        this.startLoading();

        const pushRef = this.tableRef.push(model);

        model.Id = pushRef.key;

        return this.update(model);
    }

    async setList(data: T[]): Promise<any> {

        const list = [];

        for (const item of data) {

            const newItem = await this.set(item).catch(error => {
                throw error;
            });

            if (newItem) {
                list.push(newItem);
            } else {
                continue;
            }
        }
        return list;
    }


    async insertList(data: T[]): Promise<T[]> {

        const products: T[] = [];
        this.startLoading();

        for (let i = 0; i < data.length; i++) {

            const newData = await this.insert(data[i]);

            if (newData) {
                products.push(newData);
                continue;
            } else {
                console.log('error insert');
                continue;
            }
        }

        return products;
    }

    public getById(id: string): Promise<T> {

        return this.db.ref(`${this.tableName}/${id}`).once('value').then(data => {

            if (!data) {
                return null;
            }

            return data.val() as T;

        }).catch(error => {
            console.log(error);
            return null;
        });

    }

    public update(value: T): Promise<T> {

        return this.tableRef.child(value.Id).set(value).then(() => {

            this.stopLoading();

            return value;
        });

    }

    public delete(id: string): Promise<void> {
        this.startLoading();
        return this.db.ref(`${this.tableName}/${id}`).remove().then(() => {
            this.stopLoading();
        });
    }

    public getAll(): Promise<T[]> {

        this.startLoading();

        return this.tableRef.once('value')
            .then(dataSnapShot => {

                const res: T[] = [];
                dataSnapShot.forEach(data => {
                    res.push(data.val() as T);
                });

                this.stopLoading();

                return res;
            })
            .catch(error => {
                console.log(error);
                this.stopLoading();
                return [];
            });
    }

    public deleteAll(): Promise<void> {

        this.startLoading();
        return this.tableRef.remove().then(() => {
            this.stopLoading();
            return;
        });
    }
}
