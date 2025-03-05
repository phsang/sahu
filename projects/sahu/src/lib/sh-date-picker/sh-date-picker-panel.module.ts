import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerPanelComponent } from './sh-date-picker-panel.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DatePickerPanelComponent],
  imports: [CommonModule, FormsModule],
  exports: [DatePickerPanelComponent],
})
export class ShDatePickerPanelModule { }
