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

  getByPage(page: number, itemsPerPage: number): Promise<Tag[]> {

    this.startLoading();

    let query = this.tableRef.orderByChild('Index')
      .startAt((page - 1) * itemsPerPage + 1)
      .endAt(itemsPerPage * page)
      .once('value');

    return query.then(snapshot => {
      this.stopLoading();
      const tags = [];
      snapshot.forEach(snap => {
        const tag = snap.val() as Tag;

        tags.push(tag);
      });

      return tags;

    }).catch(error => {
      this.stopLoading();
      this.errorToast(error);
      return [];
    })
  }

  getCount(): Promise<number> {
    this.startLoading();
    return this.tableRef.orderByChild('Index').limitToLast(1).once('value')
      .then(snapshot => {

        this.stopLoading();

        let tag: Tag;
        snapshot.forEach(snap => {
          tag = snap.val() as Tag;
        });

        return tag.Index;
      })
      .catch(error => {
        this.errorToast(error);
        return 0;
      });
  }
}
