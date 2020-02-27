import { Roles } from './enums';
import { BaseModel } from './base.model';


export class LoginModel {
    userName: string;
    passcode: string;

    constructor() {
    }
}

export class User extends BaseModel {
    AvtUrl: string;
    PhoneNumber: string;
    FullName: string;
    Role: Roles;
    LoginId: string;
    constructor() {
        super();
    }
}
