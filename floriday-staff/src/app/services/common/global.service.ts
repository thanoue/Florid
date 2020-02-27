import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GenericModel } from 'src/app/models/generic.model';

declare function setStatusBarColor(isDark: boolean): any;

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    insertDataCallback: BehaviorSubject<GenericModel> = new BehaviorSubject<GenericModel>(null);
    insertDataWithIdResCallback: BehaviorSubject<GenericModel> = new BehaviorSubject<GenericModel>(null);
    spinnerInvoke: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    startLoading() {
        this.spinnerInvoke.next(true);
    }

    stopLoading() {
        this.spinnerInvoke.next(false);
    }

    insertData(data: GenericModel) {
        this.insertDataCallback.next(data);
    }

    insertWithIdResData(data: GenericModel) {
        this.insertDataWithIdResCallback.next(data);
    }

    setStatusBarColor(isDark: boolean) {
        setStatusBarColor(isDark);
    }
}
