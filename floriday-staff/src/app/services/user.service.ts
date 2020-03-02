import { User } from '../models/user.model';
import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService<User> {

    datab: firebase.database.Database;

    protected tablePath(): string {
        return '/users';
    }


    constructor(db: AngularFireDatabase) {
        super(db);
        this.datab = firebase.database();
    }

    async getByLoginId(loginId: string): Promise<User> {

        this.globalService.startLoading();

        console.log('login id : ', loginId);

        // tslint:disable-next-line:max-line-length
        return this.datab.ref(`${this.tablePath()}/${loginId}`).once('value').then(user => {
            console.log(user.val().AvtUrl);
            this.globalService.stopLoading();
            return (user.val() as User);
        });
    }
}
