import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent extends BaseComponent {

  constructor() {
    super();
  }
  protected Init() {
    console.log('main  layout component');
  }
}
