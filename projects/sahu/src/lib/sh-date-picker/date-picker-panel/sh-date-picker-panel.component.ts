import { Component, EventEmitter, Input, NgModule, Output } from "@angular/core";

@Component({
  selector: 'sh-date-picker-panel',
  template: `
    <div class="date-picker-panel">
      <sh-calendar-box [shRange]="shRange" [shMin]="shMin" [shMax]="shMax" (dateSelected)="confirmSelection($event)"></sh-calendar-box>
    </div>
  `,
  styles: [
    `.date-picker-panel { background: white; padding: 10px; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }`
  ]
})
export class DatePickerPanelComponent {
  @Input() shMin?: string;
  @Input() shMax?: string;
  @Input() shRange: boolean = false;
  @Output() valueChange = new EventEmitter<string | { start_date: string; end_date: string }>();

  confirmSelection(value: string | { start_date: string; end_date: string }) {
    this.valueChange.emit(value);
  }
}