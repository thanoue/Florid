import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QRCodeModule } from 'angularx-qrcode';
import { AppInjector } from './services/common/base.injector';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { PrinterComponent } from './components/printer/printer.component';
import { TextBoxComponent } from './controls/text-box/text-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvalidTypeDirective } from './directives/invalid-type.directive';
import { InvalidmessageDirective } from './directives/invalid-message.directive';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';
import { OrdersManageComponent } from './components/orders-manage/orders-manage.component';
import { AddOrderComponent } from './components/add-order/add-order.component';
import { SelectCustomerComponent } from './components/select-customer/select-customer.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { SelectReceiverComponent } from './components/select-receiver/select-receiver.component';
import { registerLocaleData } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchProductComponent } from './components/search-product/search-product.component';
import { ToastrModule } from 'ngx-toastr';
import es from '@angular/common/locales/es';
import vi from '@angular/common/locales/vi';
import { SaleOptionComponent } from './components/sale-option/sale-option.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { SearchBoxComponent } from './controls/search-box/search-box.component';
import { ViewOrderDetailComponent } from './components/view-order-detail/view-order-detail.component';
import { StatusPointComponent } from './controls/status-point/status-point.component';
import { SortOrderChangingComponent } from './components/sort-order-changing/sort-order-changing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FloristMainComponent } from './components/florist-main/florist-main.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    HomeComponent,
    TextBoxComponent,
    InvalidTypeDirective,
    InvalidmessageDirective,
    OrdersManageComponent,
    AddOrderComponent,
    SelectCustomerComponent,
    OrderDetailComponent,
    SelectReceiverComponent,
    NotFoundComponent,
    SearchProductComponent,
    SaleOptionComponent,
    PrinterComponent,
    SearchBoxComponent,
    ViewOrderDetailComponent,
    StatusPointComponent,
    SortOrderChangingComponent,
    FloristMainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.chasingDots,
      backdropBackgroundColour: 'rgba(0, 0, 0, 0.6)',
      backdropBorderRadius: '4px',
      primaryColour: '#59f2f7',
      secondaryColour: '#59f2f7',
      tertiaryColour: '#59f2f7',
      fullScreenBackdrop: true,
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    DragDropModule
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'vi' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
    registerLocaleData(es);
    registerLocaleData(vi);
  }

}
