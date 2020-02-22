import { BaseModel } from './base.model';
export class BaseFile extends BaseModel {

    Name: string;
    Url: string;
    FolderName: string;
}

export class Receipt extends BaseFile {
    OrderId: string;
    CustomerId: string;
    constructor() {
        super();
        this.FolderName = '/receipts';
    }
}
