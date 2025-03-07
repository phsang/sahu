import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShButtonModule } from '../sh-button/sh-button.module';
import { ShInputModule } from '../sh-input/sh-input.module';
import { ShDatePickerComponent } from './sh-date-picker.component';

@NgModule({
  declarations: [ShDatePickerComponent],
  imports: [
    FormsModule,
    CommonModule,
    ShInputModule,
    ShButtonModule,
  ],
  exports: [ShDatePickerComponent],
})
export class ShDatePickerModule { }
