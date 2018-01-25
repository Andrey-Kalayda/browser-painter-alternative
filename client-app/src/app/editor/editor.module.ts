import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { SharedModule } from '../shared/shared.module';
import { EditorSyncronizationService } from '../websocket/editor-syncronization.service';
import { ConfirmationService } from 'primeng/primeng';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    EditorComponent
  ],
  providers: [
    EditorSyncronizationService,
    ConfirmationService
  ]
})
export class EditorModule { }
