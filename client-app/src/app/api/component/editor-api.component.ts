import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditorApiService } from '../service/editor-api.service';
import { DropDownStringItem } from '../model/dropdown-string-item.model';
import { Message } from 'primeng/primeng';
import { Subject, Subscription } from 'rxjs/Rx';

@Component({
    moduleId: module.id,
    selector: 'editor-api',
    templateUrl: 'editor-api.component.html',
    styleUrls: ['editor-api.component.css']
})
export class EditorApiComponent implements OnInit, OnDestroy {
    fontList: Array<DropDownStringItem> = [];
    serverDate: Date = null;
  
    messages: Array<Message> = [];
    constructor(private _service: EditorApiService) {}

    ngOnInit(): void {
        this._service.getFonts().subscribe(fonts => {
            this.fontList = fonts;
          },
          error => this.messages.push(error));
        this._service.getServerDate().subscribe(date => {
            this.serverDate = date;
          },
          error => this.messages.push(error));
    }

    ngOnDestroy(): void {}
}