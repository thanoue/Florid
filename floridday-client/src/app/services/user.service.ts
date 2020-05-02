import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../models/entities/user.entity';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService<User> {

    datab: firebase.database.Database;

    protected get tableName(): string {
        return '/users';
    }

    constructor() {
        super();
        this.datab = firebase.database();
    }

    async getByLoginId(loginId: string): Promise<User> {

        this.globalService.startLoading();

        return this.datab.ref(`${this.tableName}/${loginId}`).once('value').then(user => {
            this.globalService.stopLoading();
            return (user.val() as User);
        });
    }
}
