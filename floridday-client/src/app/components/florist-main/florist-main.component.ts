import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { ODFloristInfo, ODSeenUserInfo } from 'src/app/models/entities/order.entity';

declare function customerSupport(): any;
declare function menuOpen(callBack: (index: any) => void, items: string[]): any;

@Component({
  selector: 'app-florist-main',
  templateUrl: './florist-main.component.html',
  styleUrls: ['./florist-main.component.css']
})
export class FloristMainComponent extends BaseComponent {

  Title = 'Thợ cắm hoa';
  NavigateClass = 'nav-icon ';
  protected IsDataLosingWarning = false;
  waitingOrderDetails: OrderDetailViewModel[];
  makingOrderDetails: OrderDetailViewModel[];

  waitingMenuItems = [
    'Nhận đơn',
    'Xem chi tiết đơn',
  ];

  makingMenuItems = [
    'Hoàn thành đơn',
    'Xem chi tiết đơn',
  ];

  protected OnBackNaviage() {
    customerSupport();
  }

  logout() {

    this.authService.loutOutFirebase(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['login']);
      }

    });
  }

  protected Init() {
    this.loadWaitingDetails();
    this.loadMakingDetails();
  }

  constructor(private router: Router, private orderDetailService: OrderDetailService) {
    super();
  }

  viewDetail(orderDetail: OrderDetailViewModel) {
    this.globalOrderDetail = orderDetail;
    this.router.navigate(['order-detail-view']);
  }

  loadWaitingDetails() {
    this.waitingOrderDetails = [];
    this.orderDetailService.getByFieldName('State', OrderDetailStates.Waiting)
      .then(details => {

        details.forEach(detail => {
          this.waitingOrderDetails.push(OrderDetailViewModel.ToViewModel(detail));
        });
        this.waitingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)

      });
  }

  loadMakingDetails() {
    this.makingOrderDetails = [];
    this.orderDetailService.getByFieldName('State', OrderDetailStates.Making)
      .then(details => {

        details.forEach(detail => {
          if (detail.FloristInfo.Id === this.CurrentUser.Id) {
            this.makingOrderDetails.push(OrderDetailViewModel.ToViewModel(detail));
          }
        });

      });
  }

  getMenu(orderDetail: OrderDetailViewModel) {

    menuOpen((index) => {

      switch (+index) {
        case 0:

          switch (orderDetail.State) {
            case OrderDetailStates.Waiting:

              var updates = {};

              updates[`/${orderDetail.OrderDetailId}/State`] = OrderDetailStates.Making;
              updates[`/${orderDetail.OrderDetailId}/MakingSortOrder`] = 0;

              if (!orderDetail.SeenUsers
                || orderDetail.SeenUsers.length <= 0
                || orderDetail.SeenUsers.filter(p => p.UserId == this.CurrentUser.Id).length <= 0) {

                let seen = new ODSeenUserInfo();

                seen.FullName = this.CurrentUser.FullName;
                seen.Avt = this.CurrentUser.Avt;
                seen.Role = this.CurrentUser.Role as Roles;
                seen.UserId = this.CurrentUser.Id;
                seen.SeenTime = (new Date).getTime();

                if (!orderDetail.SeenUsers)
                  orderDetail.SeenUsers = [];

                orderDetail.SeenUsers.push(seen);

                updates[`/${orderDetail.OrderDetailId}/SeenUsers`] = orderDetail.SeenUsers;
              }

              var floristInfo = new ODFloristInfo();

              floristInfo.AssignTime = (new Date).getTime();
              floristInfo.FullName = this.CurrentUser.FullName;
              floristInfo.Id = this.CurrentUser.Id;

              updates[`/${orderDetail.OrderDetailId}/FloristInfo`] = floristInfo;

              console.log(updates);
              this.orderDetailService.updateFields(updates)
                .then(() => {

                  this.loadMakingDetails();
                  this.loadWaitingDetails();

                });

              break;
            case OrderDetailStates.Making:

              this.openConfirm('chắc chắn hoàn thành đơn?', () => {

                var updates = {};

                updates[`/${orderDetail.OrderDetailId}/State`] = OrderDetailStates.Comfirming;
                updates[`/${orderDetail.OrderDetailId}/FloristInfo/CompletedTime`] = (new Date).getTime();

                this.orderDetailService.updateFields(updates)
                  .then(() => {

                    this.loadMakingDetails();
                    this.loadWaitingDetails();

                  });
              })

              break;
          }
          break;
        case 1:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['order-detail-view']);

          break;

      }
    }, orderDetail.State === OrderDetailStates.Waiting ? this.waitingMenuItems : this.makingMenuItems);

  }

}
