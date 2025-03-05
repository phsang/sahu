import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'sh-calendar-box',
  template: `
    <div class="calendar-box">
      <div class="calendar-header">
        <button (click)="prevYear()">«</button>
        <button (click)="prevMonth()">‹</button>
        <span>{{ currentMonth }} {{ currentYear }}</span>
        <button (click)="nextMonth()">›</button>
        <button (click)="nextYear()">»</button>
      </div>
      <div class="calendar-grid">
        <div class="day-label" *ngFor="let day of weekDays">{{ day }}</div>
        <div class="day" *ngFor="let day of calendarDays" (click)="selectDay(day)" [class.selected]="day.selected">
          {{ day.date }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `.calendar-box { width: 250px; text-align: center; }
     .calendar-header { display: flex; justify-content: space-between; padding: 5px; }
     .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
     .day { padding: 5px; cursor: pointer; border-radius: 5px; }
     .day.selected { background: #007bff; color: white; }`
  ]
})
export class CalendarBoxComponent implements OnChanges {
  @Input() shMin?: string;
  @Input() shMax?: string;
  @Input() shRange: boolean = false;
  @Input() value?: string | { start_date: string; end_date: string };
  @Output() dateSelected = new EventEmitter<string | { start_date: string; end_date: string }>();

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  calendarDays: any[] = [];
  selectedDates: { start_date?: string; end_date?: string } = {};
  flagDate: any;

  constructor() {
    this.setTargetDate();
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.setTargetDate();
      this.generateCalendar();
    }
  }

  setTargetDate() {
    if (this.value) {
      const dateStr = typeof this.value === 'string' ? this.value : this.value.start_date;
      if (dateStr) {
        const targetDate = new Date(dateStr);
        if (!isNaN(targetDate.getTime())) {
          this.currentYear = targetDate.getFullYear();
          this.currentMonth = targetDate.getMonth();
        }
      }

      this.flagDate = this.value;
    }
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    this.calendarDays = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const _date = new Date(this.currentYear, this.currentMonth, i);
      const fullDate = _date.toLocaleDateString('en-CA'); // Định dạng YYYY-MM-DD

      let selected;
      if (this.shRange) {
        const start = this.flagDate?.start_date ? new Date(this.flagDate.start_date) : null;
        const end = this.flagDate?.end_date ? new Date(this.flagDate.end_date) : null;

        console.log(fullDate, this.flagDate?.start_date, this.flagDate?.end_date);

        if (start && _date >= start && end && _date <= end) {
          selected = true;
        } else {
          selected = false;
        }
      } else {
        selected = this.value === fullDate;
      }

      this.calendarDays.push({
        date: i,
        fullDate,
        selected: selected
      });
    }
  }

  prevMonth() {
    this.currentMonth--;
    this.generateCalendar();
  }
  nextMonth() {
    this.currentMonth++;
    this.generateCalendar();
  }
  prevYear() {
    this.currentYear--;
    this.generateCalendar();
  }
  nextYear() {
    this.currentYear++;
    this.generateCalendar();
  }

  selectDay(day: any) {
    if (this.shRange) {
      if (!this.selectedDates.start_date) {
        this.selectedDates.start_date = day.fullDate;
      } else {
        let start = new Date(this.selectedDates.start_date);
        let end = new Date(day.fullDate);
        if (start > end) {
          this.selectedDates.start_date = day.fullDate;
        } else {
          this.selectedDates.end_date = day.fullDate;
          this.dateSelected.emit(this.selectedDates as { start_date: string; end_date: string });
        }
      }
    } else {
      this.dateSelected.emit(day.fullDate);
    }
  }

}
