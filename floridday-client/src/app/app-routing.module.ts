import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoggedInGuard, AdminGuard } from './guards/login.guard';
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
        path: 'orders-manager',
        component: OrdersManageComponent,
      },
      {
        path: 'add-order',
        component: AddOrderComponent,
      },
      {
        path: 'add-order',
        component: AddOrderComponent,
      },
      {
        path: 'select-customer',
        component: SelectCustomerComponent,
      },
      {
        path: 'order-detail/:id',
        component: OrderDetailComponent,
      },
      {
        path: 'select-receiver',
        component: SelectReceiverComponent,
      },
      {
        path: 'search-product',
        component: SearchProductComponent,
      },
      {
        path: 'sale-option',
        component: SaleOptionComponent,
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
