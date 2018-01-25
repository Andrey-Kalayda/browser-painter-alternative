import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { EditorApiComponent } from './api/component/editor-api.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: 'editor', component: EditorComponent},
            {path: 'api', component: EditorApiComponent},
            {path: '', redirectTo: 'editor', pathMatch: 'full'},
            {path: '**', redirectTo: 'editor', pathMatch: 'full'}
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
