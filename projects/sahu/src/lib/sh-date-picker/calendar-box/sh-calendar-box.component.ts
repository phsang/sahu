import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'sh-calendar-box',
  template: `
    <div class="calendar-box">
      <div class="calendar-header">
        <button (click)="prevYear()">«</button>
        <button (click)="prevMonth()">‹</button>
        <span>{{ currentMonth + 1 }} {{ currentYear }}</span>
        <button (click)="nextMonth()">›</button>
        <button (click)="nextYear()">»</button>
      </div>
      <div class="calendar-grid">
        <div class="day-label" *ngFor="let day of weekDays">{{ day }}</div>
        <div *ngFor="let day of calendarDays">
          <div class="day {{day.checkDate}}" (click)="selectDay(day)" [class.selected]="day.selected" *ngIf="!day.disabled">
            {{ day.date }}
          </div>
          <div class="day date_disabled" [class.selected]="day.selected" *ngIf="day.disabled">
            {{ day.date }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class CalendarBoxComponent implements OnChanges {
  @Input() shMin?: string;
  @Input() shMax?: string;
  @Input() shRange: boolean = false;
  @Input() value?: string | { start_date: string; end_date: string };
  @Output() dateSelected = new EventEmitter<string | { start_date: string; end_date: string }>();

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  weekDays = ['H', 'B', 'T', 'N', 'S', 'B', 'C'];
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
    } else if (this.shMin) {
      const minDate = new Date(this.shMin);
      if (!isNaN(minDate.getTime())) {
        this.currentYear = minDate.getFullYear();
        this.currentMonth = minDate.getMonth();
      }
    }
  }

  generateCalendar() {
    this.calendarDays = [];

    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const lastDateOfMonth = lastDayOfMonth.getDate();

    // Ngày bắt đầu trong tuần (0 = Chủ Nhật, 1 = Thứ 2, ..., 6 = Thứ 7)
    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1; // Đổi Chủ Nhật (0) thành cuối tuần (6)

    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
    const nextMonthStart = 1;
    const totalDays = 42; // 6 hàng x 7 cột (để đảm bảo đầy đủ các tuần)

    const start = this.flagDate?.start_date ? new Date(this.flagDate.start_date).toLocaleDateString('en-CA') : null;
    const end = this.flagDate?.end_date ? new Date(this.flagDate.end_date).toLocaleDateString('en-CA') : null;

    for (let i = 0; i < totalDays; i++) {
      let date: number, fullDate: string, currentMonth: number;
      let isPrevMonth = i < startDay;
      let isNextMonth = i >= startDay + lastDateOfMonth;

      if (isPrevMonth) {
        date = prevMonthLastDay - (startDay - i - 1);
        currentMonth = this.currentMonth - 1;
      } else if (isNextMonth) {
        date = nextMonthStart + (i - (startDay + lastDateOfMonth));
        currentMonth = this.currentMonth + 1;
      } else {
        date = i - startDay + 1;
        currentMonth = this.currentMonth;
      }

      const displayYear = currentMonth < 0 ? this.currentYear - 1 : currentMonth > 11 ? this.currentYear + 1 : this.currentYear;
      const displayMonth = (currentMonth + 12) % 12; // Đảm bảo tháng đúng

      fullDate = new Date(displayYear, displayMonth, date).toLocaleDateString('en-CA');

      const disabled = (this.shMin && fullDate < this.shMin) || (this.shMax && fullDate > this.shMax);
      const selected = this.shRange
        ? start && fullDate >= start && end && fullDate <= end
        : this.value === fullDate;

      let checkDate = '';
      if (this.shRange) {
        checkDate = fullDate === start ? 'start_date' : fullDate === end ? 'end_date' : '';
      } else if (selected) {
        checkDate = 'single_date';
      }

      this.calendarDays.push({
        date,
        fullDate,
        selected,
        checkDate,
        disabled,
        isCurrentMonth: !isPrevMonth && !isNextMonth
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
