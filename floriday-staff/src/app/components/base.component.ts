import { OnInit, Inject, forwardRef, Injector, AfterViewInit, OnDestroy } from '@angular/core';
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

export abstract class BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    protected globalService: GlobalService;
    protected authService: AuthService;

    abstract Title: string;
    abstract NavigateClass: string;

    private navigateOnClick: Subscription;

    ngOnInit(): void {
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
    }

    constructor(protected activatedRoute: ActivatedRoute) {
        const injector = AppInjector.getInjector();
        this.globalService = injector.get(GlobalService);
        this.authService = injector.get(AuthService);
    }

    protected startLoading() {
        this.globalService.startLoading();
    }

    protected stopLoading() {
        this.globalService.stopLoading();
    }

    protected insertData(model: GenericModel) {
        this.globalService.insertData(model);
    }

    protected insertDataWithIdResult(model: GenericModel) {
        this.globalService.insertWithIdResData(model);
    }

    protected setStatusBarColor(isDark: boolean) {
        this.globalService.setStatusBarColor(isDark);
    }

    protected abstract Init();

    protected OnNavigateClick() {
    }

}
