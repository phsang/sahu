import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'sh-calendar-box',
  templateUrl: './sh-calendar-box.component.html',
})
export class CalendarBoxComponent implements OnChanges {
  @Input() shMin?: Date;
  @Input() shMax?: Date;
  @Input() shRange: boolean = false;
  @Input() value?: string | { start_date: string; end_date: string };
  @Output() dateSelected = new EventEmitter<string | { start_date: string; end_date: string }>();

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  weekDays = ['H', 'B', 'T', 'N', 'S', 'B', 'C'];
  calendarDays: any[] = [];
  selectedDates: { start_date?: string; end_date?: string } = {};
  flagDate: any;

  months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  monthSelectorOpen: boolean = false;

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
      this.currentYear = this.shMin.getFullYear();
      this.currentMonth = this.shMin.getMonth();
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
      const jMin = this.shMin ? this.shMin.toLocaleDateString('en-CA') : null;
      const jMax = this.shMax ? this.shMax.toLocaleDateString('en-CA') : null;
      let disabled = false;
      if (jMin && fullDate < jMin) {
        disabled = true;
      }
      if (jMax && fullDate > jMax) {
        disabled = true;
      }
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
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }
  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
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
    this.proccessDate(day);
    this.proccessLayout(day);
  }

  proccessDate(day: any) {
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

  proccessLayout(day: any) {
    if (!this.shRange) {
      this.calendarDays.map((item: any) => {
        item.selected = item.fullDate === day.fullDate;
        item.checkDate = item.selected ? 'single_date' : '';
      });
    } else {
      this.calendarDays.map((item: any) => {
        if (item.fullDate === day.fullDate) {
          item.checkDate = item.fullDate === this.selectedDates.start_date ? 'start_date' : 'end_date';
        }
        item.selected = item.fullDate === this.selectedDates.start_date || item.fullDate === this.selectedDates.end_date;
      });
    }
  }

  openMonthSelector() {
    this.monthSelectorOpen = true;
  }

  selectMonth(month: number) {
    this.currentMonth = month;
    this.monthSelectorOpen = false;
    this.generateCalendar();
  }

}
