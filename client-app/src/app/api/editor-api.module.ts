import { NgModule } from '@angular/core';
import { EditorApiComponent } from './component/editor-api.component';
import { EditorApiService } from './service/editor-api.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        EditorApiComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [EditorApiService]
})
export class EditorApiModule {}