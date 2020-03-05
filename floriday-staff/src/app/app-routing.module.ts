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

const routes: Routes = [

  {
    path: 'login', component: LoginComponent,
    data: { Title: 'Dang nhap', NavigateClass: 'none' }
  },
  { path: 'printjob', component: PrinterComponent },

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
