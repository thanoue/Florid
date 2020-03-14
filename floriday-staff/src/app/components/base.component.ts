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
import { OrderViewModel } from '../models/view.models/order.model';

declare function pickFile(): any;

export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    abstract Title: string;
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

    ngOnInit(): void {

        const key = 'BaseReference';
        window[key] = {
            component: this,
            zone: this.ngZone,
            dateTimeSelected: (year, month, day, hour, minute) => this.dateTimeSelected(year, month, day, hour, minute),
            forceBackNavigate: () => this.OnNavigateClick()
        };

        this.IsOnTerminal = this.globalService.isRunOnTerimal();
        this.Init();
    }

    ngOnDestroy(): void {
        this.navigateOnClick.unsubscribe();
    }

    ngAfterViewInit(): void {

        this.globalService.updateHeaderInfo(new RouteModel(this.Title, this.NavigateClass));

        this.navigateOnClick = this.globalService.navigateOnClick
            .subscribe((res) => {
                if (!res) {
                    return;
                }
                this.OnNavigateClick();
            });
        this.afterViewLoad();
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

    protected abstract Init();

    protected OnNavigateClick() {
        this.location.back();
    }

    protected afterViewLoad() {

    }
}
