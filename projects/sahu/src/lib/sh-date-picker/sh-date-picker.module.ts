import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShDatePickerComponent } from './sh-date-picker.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShDatePickerComponent],
  imports: [CommonModule, FormsModule],
  exports: [ShDatePickerComponent],
})
export class ShDatePickerModule { }
