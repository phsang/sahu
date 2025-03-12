import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShInputModule } from '../sh-input/sh-input.module';
import { ShDatePickerComponent } from './sh-date-picker.component';

@NgModule({
  declarations: [ShDatePickerComponent],
  imports: [
    FormsModule,
    CommonModule,
    ShInputModule,
  ],
  exports: [ShDatePickerComponent],
})
export class ShDatePickerModule { }
