import { AppComponent } from './app.component';
import { TopBarComponent } from './core/top-bar/top-bar.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { EditorModule } from './editor/editor.module';
import { EditorApiService } from './api/service/editor-api.service';
import { HttpModule } from '@angular/http';
import { EditorApiModule } from './api/editor-api.module';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
    AppRoutingModule,
    EditorModule,
    EditorApiModule
  ],
  providers: [
    EditorApiService
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { 
  constructor() {}
}
