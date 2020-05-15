import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from "../../models/view.models/menu.model";
import { MenuItems } from 'src/app/models/enums';
import { Tag } from 'src/app/models/entities/tag.entity';
import { TagService } from 'src/app/services/tag.service';
import { FunctionsService } from 'src/app/services/common/functions.service';
import { threadId } from 'worker_threads';
import { NgForm } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-product-tag',
  templateUrl: './product-tag.component.html',
  styleUrls: ['./product-tag.component.css']
})
export class ProductTagComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Tag Sản Phẩm', MenuItems.ProductTag);

  isSelectAll: boolean = false;
  currentPage = 1;

  tagAlias = '';

  currentTag: Tag;

  tags: {
    Tag: Tag,
    IsChecked: boolean
  }[];

  pageCount = 0;
  itemTotalCount = 0;

  _itemsPerPage: number;

  get itemPerpage(): number {
    return this._itemsPerPage;
  }

  set itemPerpage(val: number) {
    this._itemsPerPage = val;
    this.pageCount = 0;

    this.pageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;
    this.pageChanged(1);
  }

  constructor(private tagService: TagService) {
    super();
    this.currentTag = new Tag();
  }

  onTagNameChange(tagName: string) {
    this.updateTagAlias();
  }

  updateTagAlias() {

    var str = this.currentTag.Name.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim().replace(/ /g, '-');
    this.tagAlias = str;
    this.currentTag.Id = str;
  }

  addTag(form: NgForm) {

    if (!form.valid) {
      return;
    }

    this.startLoading();

    this.tagService.getById(this.currentTag.Id).then(res => {

      if (res != null) {
        this.stopLoading();
        this.showError('Tag bị trùng!!');
        return;
      }

      this.tagService.getCount()
        .then(count => {

          this.currentTag.Index = count + 1;

          this.tagService.set(this.currentTag).then(res => {

            this.stopLoading();

            this.itemTotalCount = this.currentTag.Index;

            this.pageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;

            if (this.currentPage === this.pageCount) {

              this.pageChanged(this.currentPage);

            }

            this.globalService.hidePopup();

          })
        });
    })
  }

  protected Init() {
    this.tagService.getCount().then(count => {

      this.itemTotalCount = count;
      this._itemsPerPage = 10
      this.tags = [];

      this.pageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;

      this.pageChanged(1);

    });
  }

  pageChanged(page: number) {
    this.currentPage = page;
    this.tagService.getByPage(page, this._itemsPerPage).then(tags => {
      this.tags = [];
      tags.forEach(tag => {
        this.tags.push({
          Tag: tag,
          IsChecked: false
        });
      })
    });
  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.tags.forEach(tag => {
      tag.IsChecked = isCheck;
    });
  }

  deleteTags() {

    var seletedTags = this.tags.filter(p => p.IsChecked);

    if (seletedTags.length <= 0) {
      return;
    }

    this.openConfirm('Chắc chắn xoá các tag sản phẩm?', () => {

      this.startLoading();

      let ids: string[] = [];
      let smallestTagIndex = seletedTags[0].Tag.Index;

      seletedTags.forEach(tag => {

        ids.push(tag.Tag.Id);

        if (smallestTagIndex > tag.Tag.Index) {
          smallestTagIndex = tag.Tag.Index;
        }

      })

      this.tagService.deleteMany(ids).then(() => {
        FunctionsService.excuteFunction("updateTagIndex", smallestTagIndex).then(res => {
          this.stopLoading();

          this.itemTotalCount -= seletedTags.length;
          this.tags = [];

          var newPageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;

          if (newPageCount != this.pageCount) {

            this.pageCount = newPageCount;
            this.pageChanged(1);

          } else {

            this.pageChanged(this.currentPage);

          }

          this.pageChanged(1);
        })
          .catch(error => {
            this.stopLoading();
            this.showError(error);
          });
      });

    });
  }

  deleteTag(tag: Tag) {

    this.openConfirm('Chắc chắn xoá tag sản phẩm?', () => {

      this.startLoading();

      this.tagService.delete(tag.Id).then(() => {

        FunctionsService.excuteFunction("updateTagIndex", tag.Index).then(res => {
          this.stopLoading();

          this.itemTotalCount -= 1;
          this.tags = [];

          var newPageCount = this.itemTotalCount % this._itemsPerPage === 0 ? this.itemTotalCount / this._itemsPerPage : Math.floor(this.itemTotalCount / this._itemsPerPage) + 1;

          if (newPageCount != this.pageCount) {

            this.pageCount = newPageCount;
            this.pageChanged(1);

          } else {

            this.pageChanged(this.currentPage);

          }

        })
          .catch(error => {
            this.stopLoading();
            this.showError(error);
          });

      });
    });
  }
}
