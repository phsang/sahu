import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component({
  selector: 'sh-calendar-box',
  templateUrl: './sh-calendar-box.component.html',
})
export class CalendarBoxComponent implements OnChanges {
  @Input() shMin?: Date;
  @Input() shMax?: Date;
  @Input() shRange: boolean = false;
  @Input() value?: string | string[];
  @Output() dateSelected = new EventEmitter<string | string[]>();

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  weekDays = ['H', 'B', 'T', 'N', 'S', 'B', 'C'];
  calendarDays: any[] = [];
  selectedDates: string[] = [];
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

  formatDate(date: string, type = 'date') {
    let fullDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).format(new Date(date));

    let result = fullDate;
    switch (type) {
      case 'date': {
        result = fullDate.split(',')[0].trim();
        break;
      }
      case 'hour': {
        result = fullDate.split(',')[1].trim();
        break;
      }
    }
    return result;
  }

  setTargetDate() {
    if (this.value) {
      if (typeof this.value === 'string') {
        this.value = this.formatDate(this.value);
      } else {
        this.value[0] = this.formatDate(this.value[0]);
        this.value[1] = this.formatDate(this.value[1]);
      }

      const dateStr = typeof this.value === 'string' ? this.value : this.value[0];
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

      fullDate = this.formatDate(`${displayYear}-${displayMonth + 1}-${date}`);
      const jMin = this.shMin ? this.formatDate(this.shMin.toString()) : null;
      const jMax = this.shMax ? this.formatDate(this.shMax.toString()) : null;

      let disabled = false;
      if (jMin && fullDate < jMin) {
        disabled = true;
      }
      if (jMax && fullDate > jMax) {
        disabled = true;
      }

      let selected = false;
      let checkDate = '';
      if (this.shRange) {
        if (this.flagDate?.length) {
          let start = this.flagDate[0] || null;
          let end = this.flagDate[1] || null;

          if (start && end) {
            selected = start && fullDate >= start && end && fullDate <= end;
            checkDate = fullDate === start ? 'start_date' : fullDate === end ? 'end_date' : '';
          }
        }
      } else {
        selected = this.value === fullDate;
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
    if (this.shRange) {
      if (!this.selectedDates[0]) {
        this.selectedDates[0] = day.fullDate;
      } else {
        let start = new Date(this.selectedDates[0]);
        let end = new Date(day.fullDate);
        if (start > end) {
          this.selectedDates[0] = day.fullDate;
        } else {
          this.selectedDates[1] = day.fullDate;
          this.dateSelected.emit(this.selectedDates);
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
