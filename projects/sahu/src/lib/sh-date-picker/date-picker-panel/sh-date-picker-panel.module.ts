import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerPanelComponent } from './sh-date-picker-panel.component';
import { FormsModule } from '@angular/forms';
import { CalendarBoxComponent } from '../calendar-box/sh-calendar-box.component';

@NgModule({
  declarations: [DatePickerPanelComponent, CalendarBoxComponent],
  imports: [CommonModule, FormsModule],
  exports: [DatePickerPanelComponent, CalendarBoxComponent],
})
export class ShDatePickerPanelModule { }
