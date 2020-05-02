import { BaseEntity } from './base.entity';

export class Tag extends BaseEntity {
    Name: string;
    Description: string;
    TagType: TagTypes;

    constructor() {
        super();
        this.TagType = TagTypes.Product;
    }
}

export enum TagTypes {
    Product = 'Product',
    Customer = 'Customer'
}