import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
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
