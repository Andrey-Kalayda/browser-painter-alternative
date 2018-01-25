import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from './../shared/shared.module';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, CoreModule.name);
  }
 }
