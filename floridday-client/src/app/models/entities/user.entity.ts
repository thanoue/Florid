import { Roles } from '../enums';
import { BaseEntity } from './base.entity';


export class LoginModel {
    userName: string;
    passcode: string;

    constructor() {
    }
}

export class User extends BaseEntity {
    AvtUrl: string;
    PhoneNumber: string;
    FullName: string;
    Role: Roles;
    Email: string;
    IsPrinter = false;
    Password = "";

    constructor() {
        super();
    }
}
