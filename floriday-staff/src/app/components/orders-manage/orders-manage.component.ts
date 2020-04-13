import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderViewModel, OrderDetailViewModel } from '../../models/view.models/order.model';
import { OrderDetail } from 'src/app/models/entities/order.entity';
import { OrderDetailStates } from 'src/app/models/enums';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-orders-manage',
  templateUrl: './orders-manage.component.html',
  styleUrls: ['./orders-manage.component.css']
})
export class OrdersManageComponent extends BaseComponent {

  Title = 'Danh sách đơn';
  NavigateClass = 'prev-icon';

  orders: OrderViewModel[];

  states = OrderDetailStates;

  protected IsDataLosingWarning = false;


  constructor(private customerService: CustomerService, protected activatedRoute: ActivatedRoute, private router: Router, private orderService: OrderService, private orderDetailService: OrderDetailService) {
    super();
    this.globalService.currentOrderViewModel = new OrderViewModel();
  }

  protected async Init() {

    this.setStatusBarColor(false);

    this.orders = [];

    const orderIds: string[] = [];
    const orderDetailVMs: OrderDetailViewModel[] = [];

    this.startLoading();

    const waiting = await this.orderDetailService.getAllByState(OrderDetailStates.Waiting);
    const Comfirming = await this.orderDetailService.getAllByState(OrderDetailStates.Comfirming);
    const making = await this.orderDetailService.getAllByState(OrderDetailStates.Making);
    const deliveryWaiting = await this.orderDetailService.getAllByState(OrderDetailStates.DeliveryWaiting);
    const delivering = await this.orderDetailService.getAllByState(OrderDetailStates.Delivering);
    const deliveried = await this.orderDetailService.getAllByState(OrderDetailStates.Deliveried);

    let orderdetails: OrderDetail[] = [];

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

}
