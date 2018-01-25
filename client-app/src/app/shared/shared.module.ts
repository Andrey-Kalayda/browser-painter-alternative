import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'angular4-color-picker';
import { ButtonModule, InputTextModule, ConfirmDialogModule, SliderModule, DropdownModule, GrowlModule} from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ColorPickerModule,
    ButtonModule,
    ConfirmDialogModule,
    SliderModule,
    DropdownModule,
    GrowlModule
  ],
  declarations: [
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ColorPickerModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    SliderModule,
    DropdownModule,
    GrowlModule
  ],
  providers: [
  ]
})
export class SharedModule { }
