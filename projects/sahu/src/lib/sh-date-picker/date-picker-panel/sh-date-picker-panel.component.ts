import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'sh-date-picker-panel',
  templateUrl: './sh-date-picker-panel.component.html',
})
export class DatePickerPanelComponent {
  @Input() shMin?: Date;
  @Input() shMax?: Date;
  @Input() shRange: boolean = false;
  @Input() value?: Date | [Date, Date];
  @Output() valueChange = new EventEmitter<Date | [Date, Date]>();

  confirmSelection(value: Date | [Date, Date]) {
    this.valueChange.emit(value);
  }
}
