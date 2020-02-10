import { Component, OnInit } from '@angular/core';

// declare function showToast(title, message, okBtntext, okCallback?: () => void): any;
declare function showToast(): any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  description = 'Customer list';

  ngOnInit(): void {
  }

  customers() {
    showToast();
  }

}
