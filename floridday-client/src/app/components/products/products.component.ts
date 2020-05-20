import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { PageComponent } from 'src/app/models/view.models/menu.model';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/entities/product.entity';
import { ProductCategoryService } from 'src/app/services/product.categpory.service';
import { MenuItems } from 'src/app/models/enums';
import { NgForm } from '@angular/forms';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/models/entities/tag.entity';
import { ExchangeService } from 'src/app/services/exchange.service';
import { ProductImageService } from 'src/app/services/product.image.service';
import { ProductImage } from 'src/app/models/entities/file.entity';
import { Guid } from 'guid-typescript';
import { FunctionsService } from 'src/app/services/common/functions.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { runInThisContext } from 'vm';
import { ProductTagViewModel } from 'src/app/models/view.models/product.tag.model';

declare function showProductSetupPopup();

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent extends BaseComponent {

  protected PageCompnent: PageComponent = new PageComponent('Danh sách sản phẩm', MenuItems.Product);

  pageCount = 0;
  itemTotalCount = 0;
  newTagName = "";
  edittingFile: any;
  edittingImageUrl: any;
  isSelectAll = false;
  edittingProduct: Product;

  _selectedCategory: number;
  get selectedCategory(): number {
    return this._selectedCategory;
  }
  set selectedCategory(val: number) {
    this._selectedCategory = val;
    this.categoryChange();
  }

  _itemsPerPage: number;
  get itemPerpage(): number {
    return this._itemsPerPage;
  }
  set itemPerpage(val: number) {
    this._itemsPerPage = val;
    this.categoryChange();
  }

  categories: {
    Name: string,
    Value: number,
  }[];

  edittingCategories: {
    Name: string,
    Value: number
  }[];

  globalTags: {
    Tag: Tag,
    IsSelected: boolean
  }[];

  products: {
    Product: Product,
    IsSelect: boolean,
    CategoryName: string
  }[];

  protected Init() {

    this.productCategoryService.getAllWithOrder('Index').then(categories => {

      categories.forEach(category => {

        this.categories.push({
          Name: category.Name,
          Value: category.Index
        });

        if (category.Index !== -1) {
          this.edittingCategories.push({
            Name: category.Name,
            Value: category.Index
          });
        }

      });

      this._selectedCategory = categories[0].Index;

      this.categoryChange();

    });

    this.tagService.getAll().then(tags => {
      tags.forEach(tag => {
        this.globalTags.push({
          Tag: tag,
          IsSelected: false
        });
      });
    });

  }

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService, private tagService: TagService
    , private productImageService: ProductImageService) {
    super();

    this.edittingProduct = new Product();
    this.products = [];
    this._itemsPerPage = 10;
    this.categories = [];
    this.edittingCategories = [];
    this.globalTags = [];
  }

  categoryChange() {

    this.startLoading();

    this.products = [];

    this.productService.getCategoryCount(this._selectedCategory).then(count => {

      this.itemTotalCount = count;

      if (count <= 0) {
        this.stopLoading();
        this.pageCount = 0;
        return;
      }

      this.pageCount = count % this._itemsPerPage === 0 ? count / this._itemsPerPage : Math.floor(count / this._itemsPerPage) + 1;

      this.productService.getByPage(1, this._itemsPerPage, this._selectedCategory)
        .then(products => {
          products.forEach(product => {
            this.products.push({
              Product: product,
              CategoryName: this.categories.filter(p => p.Value === product.ProductCategories)[0].Name,
              IsSelect: false
            });
          });
          this.stopLoading();
        });

    });

  }

  editProduct() {

    this.startLoading();

    if (this.edittingProduct.ImageUrl && this.edittingFile && this.edittingFile != null) {

      this.productImageService.deleteFileFromUrl(this.edittingProduct.ImageUrl)
        .then(() => {

          const prodImg = new ProductImage();
          prodImg.Name = Guid.create().toString();

          this.productImageService.addFile(this.edittingFile, prodImg, (url) => {

            if (url == 'ERROR') {
              this.stopLoading();
              return;
            }

            this.edittingProduct.ImageUrl = url;
            this.edittingFile = null;

            this.productService.set(this.edittingProduct)
              .then(() => {

                this.stopLoading();
                this.globalService.hidePopup();
                this.categoryChange();
                this.edittingProduct = new Product();
              })
              .catch(err => {
                this.showError(err);
                this.stopLoading();
                return;
              });

          });

        })
        .catch(err => {
          this.showError(err);
          this.stopLoading();
          return;
        })
    } else {

      this.productService.set(this.edittingProduct)
        .then(() => {

          this.stopLoading();
          this.globalService.hidePopup();
          this.categoryChange();
          this.edittingProduct = new Product();

        })
        .catch(err => {
          this.showError(err);
          this.stopLoading();
          return;
        });

    }
  }

  addProduct(form: NgForm) {

    if (!form.valid) {
      return;
    }

    if (this.edittingProduct.Id) {
      this.editProduct();
      return
    }

    this.startLoading();

    try {

      const prodImg = new ProductImage();
      prodImg.Name = Guid.create().toString();

      this.productImageService.addFile(this.edittingFile, prodImg, (url) => {

        this.edittingProduct.ImageUrl = url;

        this.productService.getlastCategoryIndex(this.edittingProduct.ProductCategories)
          .then(categoryIndex => {

            this.edittingProduct.CategoryIndex = categoryIndex + 1;

            let newCate = false;

            if (categoryIndex % 10000 === 0) {
              newCate = true;
              categoryIndex = 1 + (this.edittingProduct.ProductCategories + 1) * 10000;
            }

            this.productService.getByCategoryIndex(categoryIndex)
              .then(product => {

                if (!product || product == null) {

                  this.edittingProduct.Index = this.itemTotalCount + 1;

                  this.productService.set(this.edittingProduct).then(res => {
                    this.stopLoading();
                    this.globalService.hidePopup();
                    this.categoryChange();
                    this.edittingProduct = new Product();
                  });
                  return;
                }

                this.edittingProduct.Index = newCate ? product.Index : product.Index + 1;

                FunctionsService.excuteFunction('updateProductIndex', {
                  startIndex: newCate ? product.Index : product.Index + 1,
                  delta: 1
                }).then(() => {
                  this.productService.set(this.edittingProduct).then(res => {
                    this.stopLoading();
                    this.globalService.hidePopup();
                    this.categoryChange();
                    this.edittingProduct = new Product();
                  });
                })
              });
          });
      });
    }
    catch (err) {
      this.stopLoading();
      this.showError(err);
      return;
    }

  }

  deleteProduct(id: string) {

    this.openConfirm('Chắc chắn xoá sản phẩm này?', () => {

      this.startLoading();

      var product = this.products.filter(p => p.Product.Id === id)[0].Product;
      if (!product) {
        return;
      }

      this.productService.delete(id)
        .then(() => {

          FunctionsService.excuteFunction('updateProductCategoryIndex', {
            startIndex: product.CategoryIndex + 1,
            delta: -1
          }).then(() => {

            this.productImageService.deleteFileFromUrl(product.ImageUrl)
              .then(res => {
                console.log(res);
              });

            this.stopLoading();
            this.categoryChange();

          }).catch(err => {

            this.stopLoading();
            this.showWarning(err);
            return;

          });

        })
        .catch(error => {
          this.showError('Xoá lỗi!');
          this.stopLoading();
        });
    });
  }

  pageChanged(page) {
    this.products = [];
    this.productService.getByPage(page, this._itemsPerPage, this._selectedCategory)
      .then(products => {
        products.forEach(product => {
          this.products.push({
            Product: product,
            CategoryName: this.categories.filter(p => p.Value === product.ProductCategories)[0].Name,
            IsSelect: false
          });
        });
        this.stopLoading();
      });

  }

  unselectTag(removingTag: ProductTagViewModel) {

    this.edittingProduct.Tags.splice(this.edittingProduct.Tags.indexOf(removingTag), 1);

    this.globalTags.forEach(tag => {

      if (removingTag.TagAlias === tag.Tag.Id) {
        tag.IsSelected = false;
      }

    });

  }

  selectTag(tagId: string) {

    this.globalTags.forEach(tag => {
      if (tagId === tag.Tag.Id) {

        this.edittingProduct.Tags.push({
          TagName: tag.Tag.Name,
          TagAlias: tag.Tag.Id
        });

        tag.IsSelected = true;
        return;
      }

    });
  }

  onChange(event) {
    const filesUpload: File = event.target.files[0];

    var mimeType = filesUpload.type;
    if (mimeType.match(/image\/*/) == null) {
      this.showError('Phải chọn hình !!');
      return;
    }

    this.edittingFile = filesUpload;

    var reader = new FileReader();

    reader.readAsDataURL(filesUpload);
    reader.onload = (_event) => {
      this.edittingImageUrl = reader.result.toString();
    }

  }

  selectProductToEdit(id: string) {

    this.edittingProduct = this.products.filter(p => p.Product.Id === id)[0].Product;
    this.edittingImageUrl = this.edittingProduct.ImageUrl;

    if (!this.edittingProduct.Tags)
      this.edittingProduct.Tags = [];

    this.globalTags.forEach(tag => {
      if (this.edittingProduct.Tags.filter(p => p.TagAlias === tag.Tag.Id).length > 0) {
        tag.IsSelected = true;
      } else {
        tag.IsSelected = false;
      }
    });

    showProductSetupPopup();

  }

  addTag() {

    const alias = ExchangeService.getAlias(this.newTagName);

    this.startLoading();
    this.tagService.getById(alias).then(res => {

      if (res != null) {
        this.stopLoading();
        this.showError('Tag bị trùng!!');
        this.newTagName = "";
        return;
      }

      this.tagService.getCount()
        .then(count => {

          let tag = new Tag();

          tag.Index = count + 1;
          tag.Name = this.newTagName;
          tag.Id = alias;

          this.tagService.set(tag).then(res => {

            this.stopLoading();

            this.globalTags.push({
              Tag: res,
              IsSelected: true
            });

            this.edittingProduct.Tags.push({
              TagName: res.Name,
              TagAlias: res.Id
            });

            this.newTagName = "";

          });

        });
    });

  }

  checkAllChange(isCheck: boolean) {
    this.isSelectAll = isCheck;
    this.products.forEach(product => {
      product.IsSelect = isCheck;
    });
  }

  deleteMany() {
    const deletingProdIds = this.products.filter(p => p.IsSelect === true);

    if (!deletingProdIds || deletingProdIds.length <= 0) {
      return;
    }

    this.openConfirm('Chắc chắn muốn xoá các sản phẩm này?', () => {

      this.startLoading();

      let ids: string[] = [];

      let smallestCategoryIndexes: {
        Category: number,
        CategoryIndex: number
      }[] = [];

      let smallestIndex = deletingProdIds[0].Product.Index;

      deletingProdIds.forEach(productItem => {

        if (this.isContain(productItem.Product.ProductCategories, smallestCategoryIndexes)) {

          smallestCategoryIndexes.forEach(item => {

            if (productItem.Product.ProductCategories === item.Category) {

              if (productItem.Product.CategoryIndex < item.CategoryIndex) {
                item.CategoryIndex = productItem.Product.CategoryIndex;
              }

            }

          });

        } else {

          smallestCategoryIndexes.push({
            Category: productItem.Product.ProductCategories,
            CategoryIndex: productItem.Product.CategoryIndex
          });

        }

        ids.push(productItem.Product.Id);

        if (smallestIndex > productItem.Product.Index) {
          smallestIndex = productItem.Product.Index;
        };

      });

      console.log(smallestCategoryIndexes);

      this.productService.deleteMany(ids)
        .then(res => {

          const cateIndexes = [];
          smallestCategoryIndexes.forEach(cateIndex => {
            cateIndexes.push(cateIndex.CategoryIndex);
          })

          FunctionsService.excuteFunction('updateProductIndexMultiple', {
            smallestIndex: smallestIndex,
            smallestCateIndexes: cateIndexes
          })
            .then(() => {
              this.stopLoading();
              this.categoryChange();
            })
            .catch(err => {
              this.stopLoading();
              this.showError(err);
              return;
            })
        })
    });

  }

  isContain(category: number, indexes: {
    Category: number,
    CategoryIndex: number
  }[]): boolean {

    let isContained = false;

    indexes.forEach(item => {

      if (category === item.Category) {

        isContained = true;
      }

    });

    return isContained;

  }
}
