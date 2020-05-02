import { ProductCategories } from '../enums';
import { BaseEntity } from './base.entity';
import { Tag } from './tag.entity';
import { ProductTagViewModel } from '../view.models/product.tag.model';

export class Product extends BaseEntity {
    Name: string;
    Price: string;
    ImageUrl: string;
    ProductCategories: ProductCategories;
    Page: number;
    Index: number;
    CategoryIndex: number;
    Tags: ProductTagViewModel[];

    constructor() {
        super();
        this.Tags = [];
    }

}
