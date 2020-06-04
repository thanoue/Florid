import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Router } from '@angular/router';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { ODSeenUserInfo, ODShipperInfo } from 'src/app/models/entities/order.entity';

declare function customerSupport(): any;
declare function menuOpen(callBack: (index: any) => void, items: string[]): any;

@Component({
  selector: 'app-shipper-main',
  templateUrl: './shipper-main.component.html',
  styleUrls: ['./shipper-main.component.css']
})
export class ShipperMainComponent extends BaseComponent {

  Title = "Người giao hàng";
  NavigateClass = 'nav-icon ';
  protected IsDataLosingWarning = false;
  waitingOrderDetails: OrderDetailViewModel[];
  shippingOrderDetails: OrderDetailViewModel[];

  waitingMenuItems = [
    'Nhận đơn',
    'Xem chi tiết đơn',
  ];

  shippingMenuItems = [
    'Hoàn thành đơn',
    'Xem chi tiết đơn',
  ];

  constructor(private router: Router, private orderDetailService: OrderDetailService) {
    super();
  }

  protected Init() {
    this.loadWaitingDetails();
    this.loadShippingDetails();
  }

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

  viewDetail(orderDetail: OrderDetailViewModel) {
    this.globalOrderDetail = orderDetail;
    this.router.navigate(['order-detail-view']);
  }

  loadWaitingDetails() {
    this.waitingOrderDetails = [];
    this.orderDetailService.getByFieldName('State', OrderDetailStates.DeliveryWaiting)
      .then(details => {

        details.forEach(detail => {
          this.waitingOrderDetails.push(OrderDetailViewModel.ToViewModel(detail));
        });
        this.waitingOrderDetails.sort((a, b) => a.ShippingSortOrder < b.ShippingSortOrder ? -1 : a.ShippingSortOrder > b.ShippingSortOrder ? 1 : 0)

      });
  }

  loadShippingDetails() {
    this.shippingOrderDetails = [];
    this.orderDetailService.getByFieldName('State', OrderDetailStates.Delivering)
      .then(details => {

        details.forEach(detail => {
          if (detail.ShipperInfo.Id === this.CurrentUser.Id) {
            this.shippingOrderDetails.push(OrderDetailViewModel.ToViewModel(detail));
          }
        });

      });
  }

  getMenu(orderDetail: OrderDetailViewModel) {

    menuOpen((index) => {

      switch (+index) {
        case 0:

          switch (orderDetail.State) {
            case OrderDetailStates.DeliveryWaiting:

              var updates = {};

              updates[`/${orderDetail.OrderDetailId}/State`] = OrderDetailStates.Delivering;
              updates[`/${orderDetail.OrderDetailId}/ShippingSortOrder`] = 0;

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

              var shipperInfo = new ODShipperInfo();

              shipperInfo.AssignTime = (new Date).getTime();
              shipperInfo.FullName = this.CurrentUser.FullName;
              shipperInfo.Id = this.CurrentUser.Id;

              updates[`/${orderDetail.OrderDetailId}/ShipperInfo`] = shipperInfo;

              this.orderDetailService.updateFields(updates)
                .then(() => {

                  this.loadShippingDetails();
                  this.loadWaitingDetails();

                });

              break;
            case OrderDetailStates.Delivering:

              this.openConfirm('chắc chắn hoàn thành đơn?', () => {
                this.globalOrderDetail = orderDetail;
                this.router.navigate(['order-detail-confirming']);
              })

              break;
          }
          break;
        case 1:

          this.globalOrderDetail = orderDetail;
          this.router.navigate(['order-detail-view']);

          break;

      }
    }, orderDetail.State === OrderDetailStates.DeliveryWaiting ? this.waitingMenuItems : this.shippingMenuItems);

  }


}
