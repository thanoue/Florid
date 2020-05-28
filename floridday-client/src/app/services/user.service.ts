import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { User } from '../models/entities/user.entity';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService<User> {


    protected get tableName(): string {
        return '/users';
    }

    constructor() {
        super();
    }

    async getByLoginId(loginId: string): Promise<User> {

        this.globalService.startLoading();

        return this.db.ref(`${this.tableName}/${loginId}`).once('value').then(user => {
            this.globalService.stopLoading();
            return (user.val() as User);
        });
    }
}
