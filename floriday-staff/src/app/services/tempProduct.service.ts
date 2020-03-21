import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BaseService } from './common/base.service';
import { StorageService } from './storage.service';
import 'firebase/database';
import { Receipt, TempProduct } from '../models/entities/file.entity';

@Injectable({
  providedIn: 'root'
})
export class TempProductService extends BaseService<TempProduct> {

  protected get tableName(): string {
    return '/tempProducts';
  }

  constructor(private storageService: StorageService) {
    super();
  }

  public updateTempProduct(file: string, model: TempProduct, updateCompletedCallback: (fileUrl: string) => void) {
    this.storageService.pushStringToStorage(file, model, (res) => {

      updateCompletedCallback(res.Url);

      this.globalService.startLoading();

      this.insert(res as TempProduct).then(re => {
        this.globalService.stopLoading();
      });

    });

  }
}
