import { User } from '../models/user.model';
import { BaseService } from './base.service';
import { Injectable } from '@angular/core';

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
}
