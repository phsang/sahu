import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShDatePickerComponent } from './sh-date-picker.component';
import { FormsModule } from '@angular/forms';
import { ShInputModule } from '../sh-input/sh-input.module';

@NgModule({
  declarations: [ShDatePickerComponent],
  imports: [CommonModule, FormsModule, ShInputModule],
  exports: [ShDatePickerComponent],
})
export class ShDatePickerModule { }
