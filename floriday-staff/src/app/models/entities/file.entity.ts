import { BaseEntity } from './base.entity';
export class BaseFile extends BaseEntity {
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
