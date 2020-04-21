import { Injectable } from '@angular/core';
import { BaseService } from './common/base.service';
import { Tag } from '../models/entities/tag.entity';

@Injectable({
  providedIn: 'root'
})
export class TagService extends BaseService<Tag> {

  protected get tableName(): string {
    return '/tags';
  }

  constructor() {
    super();
  }
}
