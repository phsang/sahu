import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'sh-date-picker-panel',
  template: `
    <div class="date-picker-panel">
      <sh-calendar-box [shRange]="shRange" [shMin]="shMin" [shMax]="shMax" [value]="value" (dateSelected)="confirmSelection($event)"></sh-calendar-box>
    </div>
  `
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
