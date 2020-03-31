import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { GenericModel } from 'src/app/models/view.models/generic.model';
import { RouteModel } from 'src/app/models/view.models/route.model';
import { OrderViewModel, OrderDetailViewModel, OrderDetailDeliveryInfo } from 'src/app/models/view.models/order.model';
import { AlertType } from 'src/app/models/enums';
import { ToastrService } from 'ngx-toastr';
import { OrderReceiverDetail } from 'src/app/models/entities/order.entity';

declare function setStatusBarColor(isDark: boolean): any;
declare function isOnTerminal(): any;
declare function alert(message: string, alertType: number): any;
declare function openConfirm(message: string, okCallback: () => void, cancelCallback: () => void): any;


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
    currentDeliveryInfoViewModels: { CustomerId: string, Info: OrderDetailDeliveryInfo }[];

    constructor(private toastr: ToastrService, private ngZone: NgZone) {

        this.currentOrderViewModel = new OrderViewModel();
        this.currentDeliveryInfoViewModels = [];

        this.notifySetup = { timeOut: 5000, tapToDismiss: true, progressBar: false, progressAnimation: 'decreasing', positionClass: 'toast-bottom-full-width', closeButton: true, extendedTimeOut: 3000 };

        const key = 'ToastReference';
        window[key] = {
            component: this,
            zone: this.ngZone,
            toastShowing: (message, alertType) => this.toastTrShowing(message, alertType)
        };
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

    toastTrShowing(message: string, alertType: number) {
        switch (alertType) {
            case AlertType.Error:
                this.toastr.error(message, 'Lỗi', this.notifySetup);
                break;
            case AlertType.Info:
                this.toastr.info(message, 'Thông tin', this.notifySetup);
                break;
            case AlertType.Success:
                this.toastr.success(message, 'Thành công', this.notifySetup);
                break;
            case AlertType.Warning:
                this.toastr.warning(message, 'Cảnh báo', this.notifySetup);
                break;
            default:
                break;
        }
    }

    showError(message: string) {
        alert(message, +AlertType.Error);
    }

    showInfo(message: string) {
        alert(message, +AlertType.Info);
    }

    showSuccess(message: string) {
        alert(message, +AlertType.Success);
    }

    showWarning(message: string) {
        alert(message, +AlertType.Warning);
    }

    openConfirm(message: string, okCallback: () => void, cancelCallback?: () => void) {
        openConfirm(message, okCallback, cancelCallback);
    }


    isRunOnTerimal(): boolean {
        return isOnTerminal();
    }
}
