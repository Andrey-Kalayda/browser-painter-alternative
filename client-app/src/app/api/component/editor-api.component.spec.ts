import {TestBed, async} from '@angular/core/testing';
import { EditorApiComponent } from './editor-api.component';
import { SharedModule } from '../../shared/shared.module';
import { EditorApiService } from '../service/editor-api.service';
import { NotificationService } from '../../core/notification.service';

describe(EditorApiComponent.name, () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
            declarations: [
                EditorApiComponent
            ],
            providers: [
                {provide: EditorApiService, useValue: null},
                {provide: NotificationService, useValue: null}
            ]
        }).compileComponents();
    }));

    it(`${EditorApiComponent.name} should be loaded`, async(() => {
        const fixture = TestBed.createComponent(EditorApiComponent);
        const editor = fixture.debugElement.componentInstance;
        expect(editor).toBeTruthy();
    }));
});