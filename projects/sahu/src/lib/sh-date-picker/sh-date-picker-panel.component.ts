import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'sh-date-picker-panel',
  templateUrl: './sh-date-picker-panel.component.html'
})
export class DatePickerPanelComponent {
  @Input() shMin?: string;
  @Input() shMax?: string;
  @Input() shRange: boolean = false;
  @Input() value?: string | { start_date: string; end_date: string };
  @Output() valueChange = new EventEmitter<string | { start_date: string; end_date: string }>();

  startDate?: string;
  endDate?: string;
  singleDate?: string;

  ngOnInit() {
    if (this.shRange && typeof this.value === 'object') {
      this.startDate = this.value.start_date;
      this.endDate = this.value.end_date;
    } else if (typeof this.value === 'string') {
      this.singleDate = this.value;
    }
  }

  confirmSelection() {
    if (this.shRange) {
      this.valueChange.emit({ start_date: this.startDate!, end_date: this.endDate! });
    } else {
      this.valueChange.emit(this.singleDate!);
    }
  }
}