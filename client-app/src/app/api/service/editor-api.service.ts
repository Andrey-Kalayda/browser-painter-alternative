import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api-service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DropDownStringItem } from '../model/dropdown-string-item.model';

@Injectable()
export class EditorApiService extends BaseApiService {
    constructor(http: Http){
        super(http, 'editor');
    }

    getFonts(): Observable<Array<DropDownStringItem>> {
        return this.get<Array<DropDownStringItem>>('fonts');
    }

    getServerDate(): Observable<Date> {
        return this.get<Date>('serverdate');
    }
}