import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BaseModel } from '../models/base.model';
import { Customer } from '../models/customer';
import { BaseService } from './common/base.service';
import { Receipt } from '../models/file.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService extends BaseService<Receipt> {

  protected tablePath(): string {
    return '/receipts';
  }

  constructor(private storageService: StorageService) {
    super();
  }

  public uploadReceipt(file: File | Blob, receipt: Receipt, updateCompletedCallback: (receiptUrl: string) => void) {

    this.storageService.pushFileToStorage(file, receipt, (res) => {
      updateCompletedCallback(res.Url);
      this.insert(res as Receipt);
    });

  }
}
