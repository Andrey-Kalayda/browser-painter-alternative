import { NgModule } from '@angular/core';
import { EditorComponent } from './editor.component';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationService } from 'primeng/primeng';
import { EditorHubService } from '../websocket/editor-hub.service';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    EditorComponent
  ],
  providers: [
    EditorHubService,
    ConfirmationService
  ]
})
export class EditorModule { }
