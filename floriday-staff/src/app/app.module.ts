import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { CustomerDetailsComponent } from './components/customer-details/customer-details-component';
import { CustomersListComponent } from './components/customers-list/customers-list-component';
import { CreateCustomerComponent } from './components/create-customer/create-customer-component';
import { AppInjector } from './services/common/base.injector';
import { GlobalService } from './services/common/global.service';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';

declare function getFirebaseConfig(): any;

@NgModule({
  declarations: [
    AppComponent,
    CustomerDetailsComponent,
    CustomersListComponent,
    CreateCustomerComponent,
    LoginComponent,
    MainLayoutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(getFirebaseConfig()),
    AngularFireDatabaseModule, // for database,
  ],
  providers: [GlobalService, AngularFireModule],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
  }
}
