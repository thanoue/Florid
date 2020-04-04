import { BaseEntity } from './base.entity';
import { extend } from 'webdriver-js-extender';

export class Tag extends BaseEntity {
    Value: string;
    Name: string;
}

export class ProductTag extends BaseEntity {
    TagId: string;
    ProductId: string;
}