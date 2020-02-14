import { Roles } from './enums';
import { BaseModel } from './base.model';


export class LoginModel {
    UserName: string;
    Passcode: string;

    constructor(userName, passCode) {
        this.Passcode = passCode;
        this.UserName = userName;
    }
}

export class User extends BaseModel {
    AvtUrl: string;
    PhoneNumber: string;
    FullName: string;
    Role: Roles;
    LoginModel: LoginModel;

    constructor() {
        super();
    }
}
