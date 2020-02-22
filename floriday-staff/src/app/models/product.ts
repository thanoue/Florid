import { ProductCategories } from './enums';
import { BaseModel } from './base.model';

export class Product extends BaseModel {
    Name: string;
    Price: string;
    ImageUrl: string;
    ProductCategories: ProductCategories;
    Page: number;
}

export class Products {
    Products: Product[];
}
