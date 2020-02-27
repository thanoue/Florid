import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, } from '@angular/common/http';
import { GlobalService } from './global.service';
import { LocalService } from './local.service';
import { shareReplay, timeout, catchError } from 'rxjs/operators';
import { REQUEST_TIMEOUT } from 'src/app/app.constants';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  static defaultHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Max-Age': '3600',
  };

  static formdataHeader = {
    'enctype': 'multipart/form-data'
  };

  private caches = {};
  protected apiHost = '';
  protected apiUrlPrefix = '/api/v1';

  protected headers: HttpHeaders;

  public createAPIURL(path: string): string {
    return this.apiHost + this.apiUrlPrefix + path;
  }

  constructor(protected http: HttpClient,
    protected globalService: GlobalService) {
    this.headers = new HttpHeaders(HttpService.defaultHeader);
  }

  private loadToken(isForm: boolean = false) {

    const token = LocalService.getAccessToken();

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

  public post(url: string, params?: HttpParams | any, loader = true): Observable<Object | any> {
    this.loadToken();
    const fullUrl = this.createAPIURL(url);
    this.globalService.startLoading();

    let request = this.http.post(fullUrl, params, { headers: this.headers })
      .pipe(timeout(REQUEST_TIMEOUT),
        catchError(this.handleError));

    request.subscribe(() => {
      this.globalService.stopLoading();
    });

    return request;

  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
