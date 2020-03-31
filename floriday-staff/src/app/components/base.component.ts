import { OnInit, Inject, forwardRef, Injector, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppInjector } from '../services/common/base.injector';
import { GenericModel } from '../models/view.models/generic.model';
import { GlobalService } from '../services/common/global.service';
import { AuthService } from '../services/common/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { RouteModel } from '../models/view.models/route.model';
import { map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { OrderViewModel, OrderDetailViewModel, OrderDetailDeliveryInfo } from '../models/view.models/order.model';
import { OrderDetail, OrderReceiverDetail } from '../models/entities/order.entity';

declare function pickFile(): any;

export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    abstract Title: string;
    protected IsDataLosingWarning = true;
    protected NavigateClass = 'prev-icon';

    protected globalService: GlobalService;
    protected authService: AuthService;
    protected location: Location;
    private ngZone: NgZone;
    private navigateOnClick: Subscription;

    IsOnTerminal: boolean;

    get currentGlobalOrder(): OrderViewModel {
        return this.globalService.currentOrderViewModel;
    }
    set currentGlobalOrder(value: OrderViewModel) {
        this.globalService.currentOrderViewModel = value;
    }

    get currentGlobalOrderDetail(): OrderDetailViewModel {
        return this.globalService.currentOrderDetailViewModel;
    }
    set currentGlobalOrderDetail(value: OrderDetailViewModel) {
        this.globalService.currentOrderDetailViewModel = value;
    }

    get globalDeliveryInfos(): { CustomerId: string, Info: OrderDetailDeliveryInfo }[] {
        return this.globalService.currentDeliveryInfoViewModels;
    }
    set globalDeliveryInfos(value: { CustomerId: string, Info: OrderDetailDeliveryInfo }[]) {
        this.globalService.currentDeliveryInfoViewModels = value;
    }

    ngOnInit(): void {

        const key = 'BaseReference';
        window[key] = {
            component: this,
            zone: this.ngZone,
            dateTimeSelected: (year, month, day, hour, minute) => this.dateTimeSelected(year, month, day, hour, minute),
            forceBackNavigate: () => this.backNavigateOnClick(),
            fileChosen: (path) => this.fileChosen(path)
        };

        this.IsOnTerminal = this.globalService.isRunOnTerimal();
        this.Init();
    }

    ngOnDestroy(): void {
        this.navigateOnClick.unsubscribe();
        this.destroy();
    }

    ngAfterViewInit(): void {

        this.globalService.updateHeaderInfo(new RouteModel(this.Title, this.NavigateClass));

        this.navigateOnClick = this.globalService.navigateOnClick
            .subscribe((res) => {

                if (!res) {
                    return;
                }

                this.backNavigateOnClick();
            });
    }

    constructor() {

        const injector = AppInjector.getInjector();
        this.globalService = injector.get(GlobalService);
        this.authService = injector.get(AuthService);
        this.location = injector.get(Location);
        this.ngZone = injector.get(NgZone);
    }

    protected dateTimeSelected(year: number, month: number, day: number, hour: number, minute: number) {

    }

    showError(message: string) {
        this.globalService.showError(message);
    }

    showInfo(message: string) {
        this.globalService.showInfo(message);
    }

    showSuccess(message: string) {
        this.globalService.showSuccess(message);
    }

    showWarning(message: string) {
        this.globalService.showWarning(message);
    }

    public openFile() {
        pickFile();
    }

    protected startLoading() {
        this.globalService.startLoading();
    }

    protected stopLoading() {
        this.globalService.stopLoading();
    }

    protected setStatusBarColor(isDark: boolean) {
        this.globalService.setStatusBarColor(isDark);
    }


    protected OnBackNaviage() {
        this.location.back();
    }

    private backNavigateOnClick() {

        if (this.IsDataLosingWarning) {
            this.openConfirm('Dữ liệu hiện tại sẽ bị mất! Bạn có chắc chắn?', () => {
                this.OnBackNaviage();
            });

        } else {
            this.OnBackNaviage();
        }
    }

    protected abstract Init();

    protected destroy() {

    }

    protected fileChosen(path: string) {
    }

    protected openConfirm(message: string, okCallback: () => void, cancelCallback?: () => void) {
        this.globalService.openConfirm(message, okCallback, cancelCallback);
    }
}
