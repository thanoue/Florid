import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { GenericModel } from 'src/app/models/view.models/generic.model';
import { RouteModel } from 'src/app/models/view.models/route.model';
import { OrderViewModel } from 'src/app/models/view.models/order.model';

declare function setStatusBarColor(isDark: boolean): any;
declare function messageDialog(title: string, message: string): any;
declare function isOnTerminal(): any;


@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    insertDataCallback: BehaviorSubject<GenericModel> = new BehaviorSubject<GenericModel>(null);
    insertDataWithIdResCallback: BehaviorSubject<GenericModel> = new BehaviorSubject<GenericModel>(null);
    spinnerInvoke: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    updateHeader: BehaviorSubject<RouteModel> = new BehaviorSubject<RouteModel>(null);

    navigateOnClick = new Subject<boolean>();
    navigateOnClickEmitter$ = this.navigateOnClick.asObservable;

    currentOrderViewModel: OrderViewModel;

    constructor() {
        this.currentOrderViewModel = new OrderViewModel();
    }

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

    updateHeaderInfo(info: RouteModel) {
        this.updateHeader.next(info);
    }

    clickOnNavigateButton() {
        this.navigateOnClick.next(true);
    }

    showMessageDialog(title: string, message: string) {
        messageDialog(title, message);
    }

    isRunOnTerimal(): boolean {
        return isOnTerminal();
    }
}
