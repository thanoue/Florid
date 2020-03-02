import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { BaseModel } from 'src/app/models/base.model';
import { AppInjector } from './base.injector';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import 'firebase/database';

export abstract class BaseService<T extends BaseModel> {

    protected globalService: GlobalService;
    protected abstract tablePath(): string;

    constructor(protected db: AngularFireDatabase) {
        const injector = AppInjector.getInjector();
        this.globalService = injector.get(GlobalService);
    }

    public insert(model: T): Promise<T> {

        this.globalService.startLoading();

        const createRef = this.db.list(this.tablePath()).push(model);

        const newKey = createRef.key;

        model.Id = newKey;

        return this.update(newKey, model);

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

        const item = this.db.object<T>(`${this.tablePath()}/${id}`).valueChanges();

        return item.toPromise().then((res) => {
            this.globalService.stopLoading();
            return res;
        });
    }

    public update(key: string, value: T): Promise<T> {
        return this.db.list(this.tablePath()).update(key, value).then(() => {

            this.globalService.stopLoading();

            return value;
        });
    }

    public delete(key: string): Promise<void> {

        this.globalService.startLoading();
        return this.db.list(this.tablePath()).remove(key).then(() => {
            this.globalService.stopLoading();
        });
    }

    public getAll(): Promise<T[]> {

        this.globalService.startLoading();
        return this.db.list<T>(this.tablePath()).valueChanges().toPromise().then(res => {
            this.globalService.stopLoading();
            return res;
        });
    }

    public deleteAll(): Promise<void> {

        this.globalService.startLoading();
        return this.db.list(this.tablePath()).remove().then(() => {
            this.globalService.stopLoading();
            return;
        });
    }
}
