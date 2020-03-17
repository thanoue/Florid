import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderViewModel, OrderDetailViewModel } from '../../models/view.models/order.model';
import { OrderDetail } from 'src/app/models/entities/order.entity';
import { OrderDetailStates } from 'src/app/models/enums';

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


  constructor(protected activatedRoute: ActivatedRoute, private router: Router) {
    super();
    this.globalService.currentOrderViewModel = new OrderViewModel();
  }

  protected Init() {

    this.setStatusBarColor(false);
    this.orders = [];

    for (let i = 1; i <= 5; i++) {

      const order = new OrderViewModel();

      order.CreatedDate = new Date();
      order.OrderId = `OR0${i}`;
      order.TotalAmount = 800000;
      order.Index = i;
      order.CustomerInfo.Name = 'Nguyễn Thị Linh';

      const orderDetais: OrderDetailViewModel[] = [];

      for (let j = 0; j < 4; j++) {

        const orderDetail = new OrderDetailViewModel();

        orderDetail.DeliveryInfo.DateTime = new Date();
        orderDetail.ProductName = 'Hoa 01';
        orderDetail.Quantity = j;
        orderDetail.ProductImageUrl = '../../../assets/images/product-img.jpg';
        orderDetail.DeliveryInfo.Address = '200 Dương Đình Hội, Phước Long B';
        orderDetail.State = j as OrderDetailStates; // OrderDetailStates.Comfirming;
        orderDetail.Index = j;
        orderDetais.push(orderDetail);

      }

      order.OrderDetails = orderDetais;

      this.orders.push(order);

    }
  }
}
