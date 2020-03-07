import { AppInjector } from './base.injector';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import * as firebase from 'firebase';
import { BaseEntity } from 'src/app/models/entities/base.entity';

export abstract class BaseService<T extends BaseEntity> {

    protected db: firebase.database.Database;

    protected globalService: GlobalService;
    protected abstract tablePath(): string;

    constructor() {
        const injector = AppInjector.getInjector();
        this.globalService = injector.get(GlobalService);
        this.db = firebase.database();
    }

    public insert(model: T): Promise<T> {

        this.globalService.startLoading();

        const pushRef = this.db.ref(this.tablePath()).push(model);

        model.Id = pushRef.key;

        return this.update(model);
    }

    async insertList(data: T[]): Promise<T[]> {

        const products: T[] = [];
        this.globalService.startLoading();

        for (let i = 1; i < data.length; i++) {

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

        this.globalService.startLoading();

        return this.db.ref(`${this.tablePath()}/${id}`).once('value').then(data => {

            return data[0].val() as T;

        }).catch(error => {
            return null;
        });

    }

    public update(value: T): Promise<T> {

        return this.db.ref(this.tablePath()).child(value.Id).set(value).then(() => {

            this.globalService.stopLoading();

            return value;
        });

    }

    public delete(id: string): Promise<void> {
        this.globalService.startLoading();
        return this.db.ref(`${this.tablePath()}/${id}`).remove().then(() => {
            this.globalService.stopLoading();
        });
    }

    public getAll(): Promise<T[]> {

        this.globalService.startLoading();

        return this.db.ref(this.tablePath()).once('value')
            .then(dataSnapShot => {

                const res: T[] = [];
                dataSnapShot.forEach(data => {
                    res.push(data.val() as T);
                });
                this.globalService.stopLoading();

                return res;
            })
            .catch(error => {
                this.globalService.stopLoading();
                return [];
            });
    }

    public deleteAll(): Promise<void> {

        this.globalService.startLoading();
        return this.db.ref(this.tablePath()).remove().then(() => {
            this.globalService.stopLoading();
            return;
        });
    }
}
