import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BaseService } from './common/base.service';
import { StorageService } from './storage.service';
import 'firebase/database';
import { Receipt } from '../models/entities/file.entity';

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
