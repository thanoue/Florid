import { OnInit, Inject, forwardRef, Injector } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppInjector } from '../services/common/base.injector';
import { GenericModel } from '../models/generic.model';
import { GlobalService } from '../services/common/global.service';
import { AuthService } from '../services/common/auth.service';

export abstract class BaseComponent implements OnInit {

    private globalService: GlobalService;
    protected authService: AuthService;

    ngOnInit(): void {
        this.Init();
    }

    constructor() {
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
}
