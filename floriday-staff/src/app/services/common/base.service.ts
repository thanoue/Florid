import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { BaseModel } from 'src/app/models/base.model';
import { AppInjector } from './base.injector';
import { Observable } from 'rxjs';

export abstract class BaseService<T extends BaseModel> {

    constructor() {
        const injector = AppInjector.getInjector();
        this.db = injector.get(AngularFireDatabase);
    }

    protected db: AngularFireDatabase;
    protected abstract tablePath(): string;

    public insert(model: T): Promise<T> {

        const createRef = this.db.list(this.tablePath()).push(model);

        const newKey = createRef.key;

        model.Id = newKey;

        return this.update(newKey, model);

    }

    public getById(id: string): Observable<T> {
        return this.db.object<T>(`${this.tablePath()}/${id}`).valueChanges();
    }

    public update(key: string, value: T): Promise<T> {
        return this.db.list(this.tablePath()).update(key, value).then(() => {
            return value;
        });
    }

    public delete(key: string): Promise<void> {
        return this.db.list(this.tablePath()).remove(key);
    }

    public getAll(): Observable<T[]> {
        return this.db.list<T>(this.tablePath()).valueChanges();
    }

    public deleteAll(): Promise<void> {
        return this.db.list(this.tablePath()).remove();
    }
}
