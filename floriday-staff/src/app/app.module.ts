import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AppInjector } from './services/common/base.injector';
import { GlobalService } from './services/common/global.service';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/home/home.component';
import { PrinterComponent } from './components/printer/printer.component';
import { TextBoxComponent } from './controls/text-box/text-box.component';
import { FormsModule } from '@angular/forms';
import { InvalidTypeDirective } from './directives/invalid-type.directive';
import { InvalidmessageDirective } from './directives/invalid-message.directive';
import * as firebase from 'firebase/app';
import { AddUserComponent } from './components/user/add-user/add-user.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpClientModule } from '@angular/common/http';

declare function getFirebaseConfig(): any;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainLayoutComponent,
    HomeComponent,
    TextBoxComponent,
    InvalidTypeDirective,
    InvalidmessageDirective,
    AddUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(getFirebaseConfig()),
    AngularFireDatabaseModule, // for database,
    AngularFireAuthModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.chasingDots,
      backdropBackgroundColour: 'rgba(0, 0, 0, 0.6)',
      backdropBorderRadius: '4px',
      primaryColour: '#59f2f7',
      secondaryColour: '#59f2f7',
      tertiaryColour: '#59f2f7',
      fullScreenBackdrop: true,
    })
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(injector: Injector) {
    AppInjector.setInjector(injector);
    firebase.initializeApp(getFirebaseConfig());
  }
}
