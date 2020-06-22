import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { OrderDetailViewModel } from 'src/app/models/view.models/order.model';
import { OrderDetailService } from 'src/app/services/order-detail.service';
import { OrderDetailStates } from 'src/app/models/enums';
import { Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sort-order-changing',
  templateUrl: './sort-order-changing.component.html',
  styleUrls: ['./sort-order-changing.component.css']
})
export class SortOrderChangingComponent extends BaseComponent {

  Title = 'Thứ tự ưu tiên';
  protected IsDataLosingWarning = false;
  makingOrderDetails: OrderDetailViewModel[];
  shippingOrderDetails: OrderDetailViewModel[];

  constructor(private orderDetailService: OrderDetailService, private router: Router) {
    super();
  }

  protected Init() {

    this.loadMakingDetails();
    this.loadShippingDetails();

  }

  loadMakingDetails() {

    this.makingOrderDetails = [];
    this.orderDetailService.getByFieldName('State', OrderDetailStates.Waiting)
      .then(details => {

        details.forEach(detail => {
          this.makingOrderDetails.push(OrderDetailViewModel.ToViewModel(detail));
        });
        this.makingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)

      });

  }

  loadShippingDetails() {

    this.shippingOrderDetails = [];
    this.orderDetailService.getByFieldName('State', OrderDetailStates.DeliveryWaiting)
      .then(details => {

        details.forEach(detail => {
          this.shippingOrderDetails.push(OrderDetailViewModel.ToViewModel(detail));
        });

        this.shippingOrderDetails.sort((a, b) => a.ShippingSortOrder < b.ShippingSortOrder ? -1 : a.ShippingSortOrder > b.ShippingSortOrder ? 1 : 0)

      });
  }

  viewDetail(orderDetail: OrderDetailViewModel) {
    this.globalOrderDetail = orderDetail;
    this.router.navigate(['order-detail-view']);
  }

  dropMakingList(event: CdkDragDrop<string[]>) {

    var oldOrder = this.makingOrderDetails[event.previousIndex].MakingSortOrder;
    var newOrder = this.makingOrderDetails[event.currentIndex].MakingSortOrder;

    console.log(oldOrder, newOrder);

    if (oldOrder === newOrder)
      return;

    let updates = {};

    this.makingOrderDetails.forEach(detail => {

      if (detail.MakingSortOrder >= newOrder && detail.MakingSortOrder <= oldOrder) {

        detail.MakingSortOrder = detail.MakingSortOrder < oldOrder ? detail.MakingSortOrder + 1 : newOrder;
        updates[`/${detail.OrderDetailId}/MakingSortOrder`] = detail.MakingSortOrder;

      }

      if (detail.MakingSortOrder <= newOrder && detail.MakingSortOrder >= oldOrder) {

        detail.MakingSortOrder = detail.MakingSortOrder > oldOrder ? detail.MakingSortOrder - 1 : newOrder;
        updates[`/${detail.OrderDetailId}/MakingSortOrder`] = detail.MakingSortOrder;

      }

    });

    this.orderDetailService.updateFields(updates)
      .then(() => {
        this.makingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)
      });
  }

  dropShippingList(event: CdkDragDrop<string[]>) {

    var oldOrder = this.shippingOrderDetails[event.previousIndex].ShippingSortOrder;
    var newOrder = this.shippingOrderDetails[event.currentIndex].ShippingSortOrder;

    if (oldOrder === newOrder)
      return;

    let updates = {};

    this.shippingOrderDetails.forEach(detail => {

      if (detail.ShippingSortOrder >= newOrder && detail.ShippingSortOrder <= oldOrder) {

        detail.ShippingSortOrder = detail.ShippingSortOrder < oldOrder ? detail.ShippingSortOrder + 1 : newOrder;
        updates[`/${detail.OrderDetailId}/ShippingSortOrder`] = detail.ShippingSortOrder;

      }

      if (detail.ShippingSortOrder <= newOrder && detail.ShippingSortOrder >= oldOrder) {

        detail.ShippingSortOrder = detail.ShippingSortOrder > oldOrder ? detail.ShippingSortOrder - 1 : newOrder;
        updates[`/${detail.OrderDetailId}/ShippingSortOrder`] = detail.ShippingSortOrder;

      }

    });

    this.orderDetailService.updateFields(updates)
      .then(() => {
        this.shippingOrderDetails.sort((a, b) => a.ShippingSortOrder < b.ShippingSortOrder ? -1 : a.ShippingSortOrder > b.ShippingSortOrder ? 1 : 0)
      });
  }

  move(state: OrderDetailStates, index: number, isUp: boolean) {

    let orderDetail: OrderDetailViewModel;
    let secondDetail: OrderDetailViewModel;

    switch (state) {

      case OrderDetailStates.Waiting:

        orderDetail = this.makingOrderDetails[index];

        if ((isUp && index <= 0) || (!isUp && index >= this.makingOrderDetails.length - 1))
          return;

        secondDetail = this.makingOrderDetails[isUp ? index - 1 : index + 1];

        if (secondDetail) {

          var updates = {};
          updates[`/${secondDetail.OrderDetailId}/MakingSortOrder`] = orderDetail.MakingSortOrder;
          updates[`/${orderDetail.OrderDetailId}/MakingSortOrder`] = secondDetail.MakingSortOrder;

          this.orderDetailService.updateFields(updates)
            .then(() => {
              let tempSort = secondDetail.MakingSortOrder;
              secondDetail.MakingSortOrder = orderDetail.MakingSortOrder;
              orderDetail.MakingSortOrder = tempSort;
              this.makingOrderDetails.sort((a, b) => a.MakingSortOrder < b.MakingSortOrder ? -1 : a.MakingSortOrder > b.MakingSortOrder ? 1 : 0)
            });

        }

        break;

      case OrderDetailStates.DeliveryWaiting:

        orderDetail = this.shippingOrderDetails[index]

        if ((isUp && index <= 0) || (!isUp && index >= this.shippingOrderDetails.length - 1))
          return;

        secondDetail = this.shippingOrderDetails[isUp ? index - 1 : index + 1];

        if (secondDetail) {

          var updates = {};
          updates[`/${secondDetail.OrderDetailId}/ShippingSortOrder`] = orderDetail.ShippingSortOrder;
          updates[`/${orderDetail.OrderDetailId}/ShippingSortOrder`] = secondDetail.ShippingSortOrder;

          this.orderDetailService.updateFields(updates)
            .then(() => {

              let tempSort = secondDetail.ShippingSortOrder;
              secondDetail.ShippingSortOrder = orderDetail.ShippingSortOrder;
              orderDetail.ShippingSortOrder = tempSort;

              this.shippingOrderDetails.sort((a, b) => a.ShippingSortOrder < b.ShippingSortOrder ? -1 : a.ShippingSortOrder > b.ShippingSortOrder ? 1 : 0)
            });

        }

        break;
    }
  }
}