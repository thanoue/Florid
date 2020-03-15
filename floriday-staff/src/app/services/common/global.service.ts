import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { GenericModel } from 'src/app/models/view.models/generic.model';
import { RouteModel } from 'src/app/models/view.models/route.model';
import { OrderViewModel, OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { AlertType } from 'src/app/models/enums';
import { ToastrService } from 'ngx-toastr';

declare function setStatusBarColor(isDark: boolean): any;
declare function isOnTerminal(): any;
declare function alert(message: string, alertType: number): any;


@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    notifySetup: any;

    spinnerInvoke: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    updateHeader: BehaviorSubject<RouteModel> = new BehaviorSubject<RouteModel>(null);

    navigateOnClick = new Subject<boolean>();
    navigateOnClickEmitter$ = this.navigateOnClick.asObservable;

    currentOrderViewModel: OrderViewModel;
    currentOrderDetailViewModel: OrderDetailViewModel;

    constructor(private toastr: ToastrService) {
        this.currentOrderViewModel = new OrderViewModel();
        // tslint:disable-next-line: max-line-length
        this.notifySetup = { timeOut: 15000, tapToDismiss: true, progressBar: false, progressAnimation: 'decreasing', positionClass: 'toast-bottom-right', closeButton: true, extendedTimeOut: 3000 };
    }

    startLoading() {
        this.spinnerInvoke.next(true);
    }

    stopLoading() {
        this.spinnerInvoke.next(false);
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

    showError(message: string) {
        if (!this.isRunOnTerimal()) {
            this.toastr.error(message, 'Lỗi', this.notifySetup);
        } else {
            alert(message, +AlertType.Error);
        }
    }

    showInfo(message: string) {
        if (!this.isRunOnTerimal()) {
            this.toastr.info(message, 'Thông tin', this.notifySetup);
        } else {
            alert(message, +AlertType.Info);
        }
    }

    showSuccess(message: string) {
        if (!this.isRunOnTerimal()) {
            this.toastr.success(message, 'Thành công', this.notifySetup);
        } else {
            alert(message, +AlertType.Success);
        }
    }

    showWarning(message: string) {
        if (!this.isRunOnTerimal()) {
            this.toastr.warning(message, 'Cảnh báo', this.notifySetup);
        } else {
            alert(message, +AlertType.Warning);
        }
    }


    isRunOnTerimal(): boolean {
        return isOnTerminal();
    }
}
