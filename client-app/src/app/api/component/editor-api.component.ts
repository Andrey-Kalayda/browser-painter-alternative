import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditorApiService } from '../service/editor-api.service';

@Component({
    moduleId: module.id,
    selector: 'editor-api',
    templateUrl: 'editor-api.component.html',
    styleUrls: ['editor-api.component.css']
})
export class EditorApiComponent implements OnInit, OnDestroy {
    constructor(private _service: EditorApiService) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {}
}