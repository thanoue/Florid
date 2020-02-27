import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoggedInGuard, AdminGuard } from './guards/login.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { PrinterComponent } from './components/printer/printer.component';
import { HomeComponent } from './components/home/home.component';
import { AddUserComponent } from './components/user/add-user/add-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'printjob', component: PrinterComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      }, {
        path: 'add-user',
        component: AddUserComponent,
        canActivate: [AdminGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
