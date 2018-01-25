import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { environment } from '../../../environments/environment';
import {Http, Response, Headers, URLSearchParams, RequestOptionsArgs, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Message } from 'primeng/components/common/message';

@Injectable()
export class BaseApiService {
    protected _baseUrl: string;

    constructor(private _http: Http, protected _controller: string) {
        this._baseUrl = environment.api_url;
    }

    get<TResult>(action: string, params?: URLSearchParams) {
        const requestOptions = new RequestOptions();
        requestOptions.params = params;
        return this.getData(action, requestOptions).map(response => <TResult>response.json());
    }

    post<TResult>(action: string, data: any, returnData = true) {
        const requestOptions = new RequestOptions();
        requestOptions.headers = new Headers();
        requestOptions.headers.append('Content-Type', 'application/json');
        return this.postData(action, JSON.stringify(data), requestOptions)
            .map(response => returnData ? <TResult>response.json() : null);
    }
    
    private getData(action: string, options?: RequestOptionsArgs): Observable<Response> {
        const requestOptions = options || new RequestOptions();
        requestOptions.method = 'get';
        return this.request(action, requestOptions);
    }

    private postData(action: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        const requestOptions = options || new RequestOptions();
        requestOptions.method = 'post';
        requestOptions.body = body;
        return this.request(action, requestOptions);
    }

    private url(action?: string) {
        return action 
            ? `${this._controller}/${action}` 
            : this._controller;
    }

    private request(action: string, options?: RequestOptionsArgs): Observable<Response> {
        const result = this._http.request(this._baseUrl + this.url(action), options);

        return result.catch((err, source) => {
            let message: string = `Api Error occured.${ err && err.statusText ? '\nDetails: ' + err.statusText : '' }`;
            return Observable.throw({
                severity: 'error',
                summary: 'Api error',
                detail: message
            });
        });
    }
}