import { Injectable } from '@angular/core';
import { ProductTag } from '../models/entities/tag.entity';
import { BaseService } from './common/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTagService extends BaseService<ProductTag> {

  protected get tableName(): string {
    return '/productTags';
  }

  constructor() {
    super();
  }

  getProductIdsByTag(tagValue: string): Promise<string[]> {
    this.startLoading();
    return this.tableRef.orderByChild('TagId').equalTo(tagValue).once('value')
      .then(snapShot => {

        this.stopLoading();

        const productIds: string[] = [];

        snapShot.forEach(data => {

          const prd = data.val() as ProductTag;

          productIds.push(prd.ProductId);

        });

        return productIds;

      })
      .catch(error => {
        this.stopLoading();
        this.errorToast(error);
        return [];
      });

  }

  getTagIdsByProductId(productId: string): Promise<string[]> {
    this.startLoading();
    return this.tableRef.orderByChild('ProductId').equalTo(productId).once('value')
      .then(snapShot => {

        this.stopLoading();

        const productIds: string[] = [];

        snapShot.forEach(data => {

          const prd = data.val() as ProductTag;

          productIds.push(prd.TagId);

        });

        return productIds;

      })
      .catch(error => {
        this.errorToast(error);
        return [];
      });
  }


}
