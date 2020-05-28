import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AccountGuard, LoggedInGuard, FloristGuard } from './guards/login.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { PrinterComponent } from './components/printer/printer.component';
import { HomeComponent } from './components/home/home.component';
import { OrdersManageComponent } from './components/orders-manage/orders-manage.component';
import { RouteModel } from './models/view.models/route.model';
import { AddOrderComponent } from './components/add-order/add-order.component';
import { SelectCustomerComponent } from './components/select-customer/select-customer.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { SelectReceiverComponent } from './components/select-receiver/select-receiver.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchProductComponent } from './components/search-product/search-product.component';
import { SaleOptionComponent } from './components/sale-option/sale-option.component';
import { ViewOrderDetailComponent } from './components/view-order-detail/view-order-detail.component';
import { SortOrderChangingComponent } from './components/sort-order-changing/sort-order-changing.component';
import { FloristMainComponent } from './components/florist-main/florist-main.component';

const routes: Routes = [
  { path: 'print-job', component: PrinterComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'sort-order-changing',
        component: SortOrderChangingComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'account-main',
        component: OrdersManageComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'add-order',
        component: AddOrderComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'add-order',
        component: AddOrderComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'select-customer',
        component: SelectCustomerComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'order-detail/:id',
        component: OrderDetailComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'select-receiver',
        component: SelectReceiverComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'search-product',
        component: SearchProductComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'sale-option',
        component: SaleOptionComponent,
        canActivate: [AccountGuard]
      },
      {
        path: 'order-detail-view',
        component: ViewOrderDetailComponent,
      },
      {
        path: 'florist-main',
        component: FloristMainComponent,
        canActivate: [FloristGuard]
      },
    ]
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
