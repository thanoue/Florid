import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { map, filter, scan } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/common/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnDestroy {

  navigateClass: string;
  title: string;
  headerUpdate: Subscription;

  constructor(public router: Router, private globalService: GlobalService) {

    console.log('pass to main layout');

    this.navigateClass = 'prev-icon';
    this.title = '';

    this.headerUpdate = this.globalService.updateHeader
      .subscribe(headerInfo => {

        if (headerInfo === null || !headerInfo) {
          return;
        }

        this.updateHeaderBar(headerInfo.Title, headerInfo.NavigateClass);
      });

  }

  public updateHeaderBar(title: string, navigateClass: string) {
    setTimeout(() => {
      this.navigateClass = navigateClass;
      this.title = title;
    }, 100);
  }

  protected Init() {
    this.globalService.setStatusBarColor(false);
  }

  ngOnDestroy(): void {
    this.headerUpdate.unsubscribe();
  }

  navigateOnClick() {
    this.globalService.clickOnNavigateButton();
  }


}
