import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderViewModel, OrderDetailViewModel } from '../../models/view.models/order.model';
import { OrderDetail } from 'src/app/models/entities/order.entity';
import { OrderDetailStates } from 'src/app/models/enums';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { CustomerService } from 'src/app/services/customer.service';
import { ORDER_DETAIL_STATES } from 'src/app/app.constants';

declare function menuOpen(callBack: (index: any) => void, items: string[]): any;
declare function openColorBoard(): any;
declare function customerSupport(): any;

export interface ISelectedDetail {
  FloristName: string;
  State: OrderDetailStates;
  StateDisplay: string;
  ShipperName: string;
}

@Component({
  selector: 'app-orders-manage',
  templateUrl: './orders-manage.component.html',
  styleUrls: ['./orders-manage.component.css']
})
export class OrdersManageComponent extends BaseComponent {

  Title = 'Danh sách đơn';
  NavigateClass = 'nav-icon ';
  protected IsDataLosingWarning = false;

  orders: OrderViewModel[];
  states = OrderDetailStates;

  selectedDetail = {} as ISelectedDetail;

  protected OnBackNaviage() {
    customerSupport();
  }

  constructor(private customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    private router: Router, private orderService: OrderService,
    private orderDetailService: OrderDetailService) {

    super();
    this.globalService.currentOrderViewModel = new OrderViewModel();
  }

  logout() {

    this.authService.loutOutFirebase(isSuccess => {

      if (isSuccess) {
        this.router.navigate(['login']);
      }

    });
  }

  protected async Init() {

    this.setStatusBarColor(false);

    this.orders = [];

    const orderIds: string[] = [];
    const orderDetailVMs: OrderDetailViewModel[] = [];

    this.startLoading();

    const added = await this.orderDetailService.getAllByState(OrderDetailStates.Added);
    const waiting = await this.orderDetailService.getAllByState(OrderDetailStates.Waiting);
    const Comfirming = await this.orderDetailService.getAllByState(OrderDetailStates.Comfirming);
    const making = await this.orderDetailService.getAllByState(OrderDetailStates.Making);
    const deliveryWaiting = await this.orderDetailService.getAllByState(OrderDetailStates.DeliveryWaiting);
    const delivering = await this.orderDetailService.getAllByState(OrderDetailStates.Delivering);
    const deliveried = await this.orderDetailService.getAllByState(OrderDetailStates.Deliveried);

    let orderdetails: OrderDetail[] = [];

    orderdetails = orderdetails.concat(added);
    orderdetails = orderdetails.concat(waiting);
    orderdetails = orderdetails.concat(Comfirming);
    orderdetails = orderdetails.concat(making);
    orderdetails = orderdetails.concat(deliveryWaiting);
    orderdetails = orderdetails.concat(delivering);
    orderdetails = orderdetails.concat(deliveried);

    orderdetails.forEach(orderDetail => {

      if (orderIds.indexOf(orderDetail.OrderId) <= -1) {
        orderIds.push(orderDetail.OrderId);
      }

      const orderDetailVM = OrderDetailViewModel.ToViewModel(orderDetail);

      orderDetailVMs.push(orderDetailVM);

    });

    orderIds.forEach(async orderId => {

      const order = await this.orderService.getById(orderId);

      const customer = await this.customerService.getById(order.CustomerId);

      const orderVM = OrderViewModel.ToViewModel(order, customer);

      orderDetailVMs.forEach(orderDetailVM => {

        if (orderDetailVM.OrderId === orderVM.OrderId) {
          orderVM.OrderDetails.push(orderDetailVM);
        }

      });

      this.orders.push(orderVM);

      this.orders = this.orders.sort((n1, n2) => {
        if (n1.CreatedDate < n2.CreatedDate) {
          return 1;
        }

        if (n1.CreatedDate > n2.CreatedDate) {
          return -1;
        }

        return 0;

      });

    });

    this.stopLoading();

  }

  editOrder(orderId: string) {
    this.globalOrder = this.orders.filter(p => p.OrderId === orderId)[0];
    this.router.navigate(['/add-order']);
  }

  openDetailInfo(id: string) {

    this.orders.forEach(order => {
      let isGot = false;

      order.OrderDetails.forEach(orderDetail => {

        if (orderDetail.OrderDetailId === id) {
          this.selectedDetail.FloristName = orderDetail.FloristInfo ? orderDetail.FloristInfo.FullName : '...';
          this.selectedDetail.ShipperName = orderDetail.ShipperInfo ? orderDetail.ShipperInfo.FullName : '...';
          this.selectedDetail.State = orderDetail.State;
          this.selectedDetail.StateDisplay = ORDER_DETAIL_STATES.filter(p => p.State === orderDetail.State)[0].DisplayName;

          isGot = true;

          return;

        }
      });

      if (isGot)
        return;

    });

    openColorBoard();
  }

  updateOrderDetailState(id: string) {

    let orderDetail: OrderDetailViewModel = new OrderDetailViewModel();
    let selectedOrder: OrderViewModel = new OrderViewModel();

    this.orders.forEach(order => {

      order.OrderDetails.forEach(detail => {
        if (detail.OrderDetailId === id) {
          orderDetail = detail;
          selectedOrder = order;
          return;
        }
      });

      if (orderDetail.OrderDetailId !== '') {
        return;
      }

    });

    switch (orderDetail.State) {
      case OrderDetailStates.Added:
        this.updateAddedDetailState(orderDetail, selectedOrder);
        break;
      case OrderDetailStates.Waiting:
        this.updateWaitingDetailState(orderDetail, selectedOrder);
        break;
    }
  }

  updateWaitingDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Xử lý sau',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:

          var updates = {};

          updates[`/${orderDetail.OrderDetailId}/State`] = OrderDetailStates.Added;
          updates[`/${orderDetail.OrderDetailId}/MakingSortOrder`] = 0;

          this.orderDetailService.updateFields(updates)
            .then(() => {

              orderDetail.State = OrderDetailStates.Added;
              orderDetail.MakingSortOrder = 0;

            });

          break;

        case 1:
          this.globalOrderDetail = orderDetail;
          this.router.navigate(['order-detail-view']);
          break;

        case 2:

          this.orderDetailService.updateSingleField(orderDetail.OrderDetailId, 'State', OrderDetailStates.Canceled)
            .then(() => {

              this.deleteOrderDetail(orderDetail, order);

            });

          break;
      }
    }, items);

  }

  updateAddedDetailState(orderDetail: OrderDetailViewModel, order: OrderViewModel) {

    let items = [
      'Chuyển cho Florist',
      'Xem chi tiết',
      'Huỷ đơn'
    ];

    menuOpen((index) => {
      switch ((+index)) {
        case 0:

          this.orderDetailService.getNextMakingSortOrder()
            .then(sortOrder => {
              console.log('sort order', sortOrder)
              var updates = {};

              updates[`/${orderDetail.OrderDetailId}/State`] = OrderDetailStates.Waiting;
              updates[`/${orderDetail.OrderDetailId}/MakingSortOrder`] = sortOrder;

              this.orderDetailService.updateFields(updates)
                .then(() => {
                  orderDetail.State = OrderDetailStates.Waiting;
                  orderDetail.MakingSortOrder = sortOrder;
                });
            });

          break;

        case 1:
          this.globalOrderDetail = orderDetail;
          this.router.navigate(['order-detail-view']);
          break;

        case 2:

          this.orderDetailService.updateSingleField(orderDetail.OrderDetailId, 'State', OrderDetailStates.Canceled)
            .then(() => {
              this.deleteOrderDetail(orderDetail, order);
            });

          break;
      }
    }, items);
  }

  deleteOrderDetail(orderDetail: OrderDetailViewModel, order: OrderViewModel) {
    let index = order.OrderDetails.indexOf(orderDetail);
    order.OrderDetails.splice(index, 1);

    if (order.OrderDetails.length <= 0) {

      let selectedOrder = this.orders.filter(p => p.OrderId == order.OrderId)[0];

      this.orders.splice(this.orders.indexOf(selectedOrder), 1);
    }

  }

}
