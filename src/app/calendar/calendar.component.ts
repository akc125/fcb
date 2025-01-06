import { Component } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  today: string = this.formatDate(new Date());
  dates: any[] = [];
  holidays: { [key: string]: string } = {
    '2025-01-01': 'New Year\'s Day',
    '2025-01-26': 'Republic Day',
    // Add more holidays as needed
  };

  constructor() {
    this.generateCalendar();
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  generateCalendar(): void {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    const dates = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay || dayCounter > daysInMonth) {
          week.push(null);
        } else {
          const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(dayCounter).padStart(2, '0')}`;
          week.push({
            day: dayCounter,
            isHoliday: !!this.holidays[dateStr],
            holidayName: this.holidays[dateStr],
            isToday: dateStr === this.today,
          });
          dayCounter++;
        }
      }
      dates.push(week);
    }

    this.dates = dates;
  }

  changeMonth(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const monthIndex = Number(target.value);
    this.currentMonth = monthIndex;
    this.generateCalendar();
  }
  
}








