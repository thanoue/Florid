import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersListComponent } from './components/customers-list/customers-list-component';
import { CreateCustomerComponent } from './components/create-customer/create-customer-component';
import { LoginComponent } from './components/login/login.component';
import { LoggedInGuard } from './guards/login.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
