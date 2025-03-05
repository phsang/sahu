import { Component, EventEmitter, Input, Output } from "@angular/core";

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
        <div class="day" *ngFor="let day of calendarDays" (click)="selectDay(day)" [class.selected]="isSelected(day)">
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
export class CalendarBoxComponent {
  @Input() shMin?: string;
  @Input() shMax?: string;
  @Input() shRange: boolean = false;
  @Output() dateSelected = new EventEmitter<string | { start_date: string; end_date: string }>();

  currentYear = new Date().getFullYear();
  currentMonth = new Date().toLocaleString('default', { month: 'long' });
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: any[] = [];

  selectedDates: { start_date?: string; end_date?: string } = {};

  constructor() {
    this.generateCalendar();
  }

  generateCalendar() {
    // Logic to generate days of the month
  }

  prevMonth() { }
  nextMonth() { }
  prevYear() { }
  nextYear() { }

  selectDay(day: any) {
    if (this.shRange) {
      if (!this.selectedDates.start_date) {
        this.selectedDates.start_date = day.fullDate;
      } else {
        this.selectedDates.end_date = day.fullDate;
        this.dateSelected.emit(this.selectedDates as { start_date: string; end_date: string });
      }
    } else {
      this.dateSelected.emit(day.fullDate);
    }
  }

  isSelected(day: any) {
    return day.fullDate === this.selectedDates.start_date || day.fullDate === this.selectedDates.end_date;
  }
}
