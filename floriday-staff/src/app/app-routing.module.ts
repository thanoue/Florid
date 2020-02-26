import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LoggedInGuard } from './guards/login.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { PrinterComponent } from './components/printer/printer.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'printjob', component: PrinterComponent },

  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [LoggedInGuard],
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
