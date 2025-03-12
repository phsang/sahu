import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShButtonModule } from '../../sh-button/sh-button.module';
import { CalendarBoxComponent } from '../calendar-box/sh-calendar-box.component';
import { DatePickerPanelComponent } from './sh-date-picker-panel.component';

@NgModule({
  declarations: [
    DatePickerPanelComponent,
    CalendarBoxComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShButtonModule
  ],
  exports: [
    DatePickerPanelComponent,
    CalendarBoxComponent
  ],
})
export class ShDatePickerPanelModule { }
