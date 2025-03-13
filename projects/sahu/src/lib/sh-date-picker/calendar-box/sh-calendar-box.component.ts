import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'sh-calendar-box',
  templateUrl: './sh-calendar-box.component.html',
})
export class CalendarBoxComponent implements OnChanges {
  @Input() shMin?: Date;
  @Input() shMax?: Date;
  @Input() shRange: boolean = false;
  @Input() value?: Date | [Date, Date];
  @Output() dateSelected = new EventEmitter<Date | [Date, Date]>();

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  weekDays = ['H', 'B', 'T', 'N', 'S', 'B', 'C'];
  calendarDays: any[] = [];
  selectedDates: Date[] = [];
  flagDate: any;

  months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  monthSelectorOpen: boolean = false;
  years: number[] = [];
  yearSelectorOpen: boolean = false;

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

  compareDate = (date1: Date, date2: Date, type = 'same') => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();

    switch (type) {
      case 'before': {
        return d1 < d2;
      }
      case 'after':
        return d1 > d2;
      default:
        return d1 === d2;
    }
  };

  setTargetDate() {
    if (this.value) {
      if (this.value instanceof Date) {
        this.currentYear = this.value.getFullYear();
        this.currentMonth = this.value.getMonth();
      } else if (this.value instanceof Array) {
        this.currentYear = this.value[0].getFullYear();
        this.currentMonth = this.value[0].getMonth();
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

    for (let i = 0; i < totalDays; i++) {
      let date: number, fullDate: Date, currentMonth: number;
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

      let disabled = false;
      fullDate = new Date(displayYear, displayMonth, date);
      if (this.shMin && this.compareDate(fullDate, this.shMin, 'before')) {
        disabled = true;
      }
      if (this.shMax && this.compareDate(fullDate, this.shMax, 'after')) {
        disabled = true;
      }

      let selected = false;
      let checkDate = '';
      if (this.shRange && this.value instanceof Array && this.value.length === 2) {
        let start = this.value[0] || null;
        let end = this.value[1] || null;

        if (start && end) {
          selected = !(this.compareDate(fullDate, start, 'before') || this.compareDate(fullDate, end, 'after'));
          checkDate = this.compareDate(fullDate, start) ? 'start_date' : this.compareDate(fullDate, end) ? 'end_date' : '';
        }
      } else if (this.value instanceof Date) {
        selected = this.compareDate(this.value, fullDate, 'same');
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
    if (this.yearSelectorOpen) {
      this.currentYear -= 10;
      this.openYearSelector();
    } else {
      this.currentYear--;
    }
    this.generateCalendar();
  }
  nextYear() {
    if (this.yearSelectorOpen) {
      this.currentYear += 10;
      this.openYearSelector();
    } else {
      this.currentYear++;
    }
    this.generateCalendar();
  }

  selectDay(day: any) {
    this.proccessDate(day);
    this.proccessLayout(day);
  }

  proccessDate(day: any) {
    if (this.shRange && this.selectedDates instanceof Array) {
      if (!this.selectedDates[0]) {
        this.selectedDates[0] = day.fullDate;
      } else {
        let start = new Date(this.selectedDates[0]);
        let end = new Date(day.fullDate);

        if (start > end) {
          this.selectedDates[0] = day.fullDate;
        } else {
          this.selectedDates[1] = day.fullDate;
          if (this.selectedDates.length === 2) {
            this.dateSelected.emit([this.selectedDates[0], this.selectedDates[1]]);
          }
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
          item.checkDate = item.fullDate === this.selectedDates[0] ? 'start_date' : 'end_date';
        }
        item.selected = item.fullDate === this.selectedDates[0] || item.fullDate === this.selectedDates[1];
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

  openYearSelector() {
    this.years = [];
    let yearTmp = this.currentYear;

    while (yearTmp % 10 !== 0) {
      yearTmp--;
    }

    this.years.push(yearTmp - 1);
    for (let i = 0; i < 10; i++) {
      this.years.push(yearTmp);
      yearTmp++;
    }
    this.years.push(yearTmp);

    this.yearSelectorOpen = true;
  }

  selectYear(year: number) {
    this.currentYear = year;
    this.yearSelectorOpen = false;
    this.monthSelectorOpen = true;
    this.generateCalendar();
  }

}
