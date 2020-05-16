import { BaseService } from './common/base.service';
import { ProductCategory } from '../models/entities/product.category.entity';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProductCategoryService extends BaseService<ProductCategory>{

    protected tableName = '/productCategories';

    constructor() {
        super()
    }
}