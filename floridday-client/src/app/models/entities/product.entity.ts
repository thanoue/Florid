import { ProductCategories } from '../enums';
import { BaseEntity } from './base.entity';

export class Product extends BaseEntity {
    Name: string;
    Price: string;
    ImageUrl: string;
    ProductCategories: ProductCategories;
    Page: number;
    Index: number;
    CategoryIndex: number;
}

export class Products {
    Products: Product[];
}
