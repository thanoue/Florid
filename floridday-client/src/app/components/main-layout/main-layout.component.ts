import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map, filter, scan } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/common/global.service';
import { Subscription } from 'rxjs';
import { LocalService } from 'src/app/services/common/local.service';
import { OnlineUserService } from 'src/app/services/online.user.service';
import { AuthService } from 'src/app/services/common/auth.service';
import { PrintJobService } from 'src/app/services/print-job.service';

declare function doPrintJob(data: {}): any;

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnDestroy, OnInit {

  navigateClass: string;
  title: string;
  headerUpdate: Subscription;

  constructor(public router: Router, private globalService: GlobalService, private onlineUserService: OnlineUserService, private authService: AuthService
    , private printJobService: PrintJobService) {

    this.navigateClass = '';
    this.title = '';

    this.headerUpdate = this.globalService.updateHeader
      .subscribe(headerInfo => {

        if (headerInfo === null || !headerInfo) {
          return;
        }

        this.updateHeaderBar(headerInfo.Title, headerInfo.NavigateClass);

      });

  }
  ngOnInit(): void {

    this.onlineUserService.loginTimeChanging(LocalService.getUserId(), (userId) => {
      this.authService.loutOutFirebase((loggedOut) => {
        if (loggedOut) {
          this.router.navigate(['login']);
        }
      });
    });

    this.globalService.setStatusBarColor(false);

    // if (LocalService.isPrinter()) {
    //   this.printJobService.printJobAdd(data => {
    //     console.log('print data:', data);
    //     doPrintJob(data);
    //   });
    // }

  }

  public updateHeaderBar(title: string, navigateClass: string) {
    setTimeout(() => {
      this.navigateClass = navigateClass;
      this.title = title;
    }, 100);
  }

  ngOnDestroy(): void {
    this.headerUpdate.unsubscribe();
  }

  navigateOnClick() {
    this.globalService.clickOnNavigateButton();
  }


}
