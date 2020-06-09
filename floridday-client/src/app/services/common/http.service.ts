import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, } from '@angular/common/http';
import { GlobalService } from './global.service';
import { LocalService } from './local.service';
import { shareReplay, timeout, catchError } from 'rxjs/operators';
import { REQUEST_TIMEOUT } from 'src/app/app.constants';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  static defaultHeader = {
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
    'Access-Control-Max-Age': '3600',
  };

  static formdataHeader = {
    'enctype': 'multipart/form-data'
  };

  private caches = {};
  protected apiHost = environment.base_domain;
  protected apiUrlPrefix = '/api/v1';

  protected headers: HttpHeaders;

  public createAPIURL(path: string): string {
    return this.apiHost + this.apiUrlPrefix + path;
  }

  constructor(protected http: HttpClient, protected globalService: GlobalService) {
    this.headers = new HttpHeaders(HttpService.defaultHeader);
  }

  private loadToken(isForm: boolean = false) {

    const token = LocalService.getApiAccessToken();

    if (token === '' || !token) {
      this.headers = new HttpHeaders(isForm ? HttpService.formdataHeader : HttpService.defaultHeader);
    } else {
      this.headers = new HttpHeaders({
        ...isForm ? HttpService.formdataHeader : HttpService.defaultHeader,
        ...{ 'Authorization': `Bearer ${token}` }
      });
    }
  }

  public get(url: string, params?: HttpParams | any, cache: boolean = false): Observable<Object | any> {
    this.loadToken();

    if (cache && this.caches[url]) {
      this.globalService.startLoading();
      return this.caches[url];
    }

    const fullUrl = this.createAPIURL(url);

    this.globalService.startLoading();

    const res = this.http.get(fullUrl, { headers: this.headers, params: params })
      .pipe(shareReplay(1),
        timeout(REQUEST_TIMEOUT),
        catchError(this.handleError)
      );

    res.subscribe(() => {
      this.globalService.stopLoading();
    });

    if (cache) {
      this.caches[url] = res;
    }

    return res;
  }


  public sendMomoTransRes(url: string, params?: HttpParams | any, loader = true): Observable<object | any> {

    const fullUrl = environment.momo_generate_qr_domain + url;
    this.globalService.startLoading();

    let request = this.http.post(fullUrl, params, { headers: this.headers })
      .pipe(timeout(REQUEST_TIMEOUT),
        catchError(this.handleError));

    request.subscribe(() => {
      this.globalService.stopLoading();
    });

    return request;
  }

  public post(url: string, params?: HttpParams | any, loader = true): Observable<object | any> {

    this.loadToken();
    const fullUrl = this.createAPIURL(url);

    if (loader) {
      this.globalService.startLoading();
    }

    const request = this.http.post(fullUrl, params, { headers: this.headers })
      .pipe(timeout(REQUEST_TIMEOUT),
        catchError(this.handleError));

    request.subscribe(() => {
      if (loader) {
        this.globalService.stopLoading();
      }
    });

    return request;

  }

  private handleError(error: HttpErrorResponse) {
    console.log(error.error.message);
    // return an observable with a user-facing error message
    return throwError(
      error.error.message);
  }

}
