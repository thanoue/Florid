import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { ORDER_DETAIL_STATES } from 'src/app/app.constants';
import { OrderDetailStates, Roles } from 'src/app/models/enums';
import { ODSeenUserInfo } from 'src/app/models/entities/order.entity';
import { OrderDetailService } from 'src/app/services/order-detail.service';

declare function openViewed(): any;
@Component({
  selector: 'app-view-order-detail',
  templateUrl: './view-order-detail.component.html',
  styleUrls: ['./view-order-detail.component.css']
})
export class ViewOrderDetailComponent extends BaseComponent {

  Title = 'Chi tiết đơn';
  IsDataLosingWarning = false;
  orderDetail: OrderDetailViewModel;
  state: string;
  states = OrderDetailStates;
  canSeen = true;

  protected Init() {

    this.orderDetail = this.globalOrderDetail;

    this.state = ORDER_DETAIL_STATES.filter(p => p.State === this.orderDetail.State)[0].DisplayName;

    setTimeout(() => {

      if (!this.canSeen)
        return;

      if (this.CurrentUser.Role == Roles.Florist || this.CurrentUser.Role === Roles.Shipper) {

        if (!this.orderDetail.SeenUsers
          || this.orderDetail.SeenUsers.length <= 0
          || this.orderDetail.SeenUsers.filter(p => p.UserId == this.CurrentUser.Id).length <= 0) {

          let seen = new ODSeenUserInfo();

          seen.FullName = this.CurrentUser.FullName;
          seen.Avt = this.CurrentUser.Avt;
          seen.Role = this.CurrentUser.Role;
          seen.UserId = this.CurrentUser.Id;
          seen.SeenTime = (new Date).getTime();

          if (!this.orderDetail.SeenUsers)
            this.orderDetail.SeenUsers = [];

          this.orderDetail.SeenUsers.push(seen);

          this.orderDetailService.updateSingleField(this.orderDetail.OrderDetailId, 'SeenUsers', this.orderDetail.SeenUsers)
            .then(() => {

            });
        }
      }
    }, 2000);

  }

  protected destroy() {
    this.canSeen = false;
  }

  openViewed() {
    this.orderDetailService.getById(this.orderDetail.OrderDetailId)
      .then(detail => {
        this.orderDetail.SeenUsers = detail.SeenUsers;
        openViewed();
      });
  }

  constructor(private orderDetailService: OrderDetailService) {
    super();

  }

}
