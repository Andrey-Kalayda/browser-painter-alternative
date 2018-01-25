import { NgModule } from '@angular/core';
import { EditorApiComponent } from './component/editor-api.component';
import { EditorApiService } from './service/editor-api.service';

@NgModule({
    declarations: [
        EditorApiComponent
    ],
    imports: [],
    providers: [EditorApiService]
})
export class EditorApiModule {}