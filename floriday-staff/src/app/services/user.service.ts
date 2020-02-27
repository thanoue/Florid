import { User } from '../models/user.model';
import { BaseService } from './common/base.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService<User> {

    protected tablePath(): string {
        return '/users';
    }

    constructor() {
        super();
    }

    async getByLoginId(loginId: string): Promise<User> {

        this.globalService.startLoading();

        let list = await this.db.list<User>(this.tablePath()).valueChanges().toPromise();

        let userRet = new User();


        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < list.length; i++) {
            if (list[i].LoginId === loginId) {
                userRet = list[i];
                break;
            }
        }

        this.globalService.stopLoading();
        return userRet;
    }
}
