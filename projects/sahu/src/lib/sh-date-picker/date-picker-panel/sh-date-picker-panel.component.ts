import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'sh-date-picker-panel',
  templateUrl: './sh-date-picker-panel.component.html',
})
export class DatePickerPanelComponent {
  @Input() shMin?: Date;
  @Input() shMax?: Date;
  @Input() shRange: boolean = false;
  @Input() value?: string | string[];
  @Output() valueChange = new EventEmitter<string | string[]>();

  confirmSelection(value: string | string[]) {
    this.valueChange.emit(value);
  }
}
