import { Component } from '@angular/core';
import { CategoriesService } from 'src/services/categories.service';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    private categoriesService: CategoriesService,
    private categoriesServiceFire: CategoryFireService
  ) {}

  userId = localStorage.getItem('userId');
  defaultDate: any;
  month: any;
  year: any;
  day: any;

  categories: any[] = [];
  expense: any[] = [];
  thisMonthExpense: any[] = [];
  income: any[] = [];
  thisMonthIncome: any[] = [];
  finalExpense: any[] = [];
  lstThreeOfFiinalExpense: any[] = [];
  expensTotel: number = 0;
  incomeTotel: number = 0;
  balense: number = 0;
  average: number = 0;

  allExpense: any[] = [];
  allIncome: any[] = [];
  allExpenseTotel: number = 0;
  allIncomeTotel: number = 0;
  allBalence: number = 0;

  trackedExpenses: any[] = [];
  newTrckedArray: any[] = [];

  groupedExpenses: {
    date: string;
    items: { category: string; expense: number }[];
    total: number;
  }[] = [];

  chartOptions: any;

  ngOnInit(): void {
    const currentDate = new Date();
    this.month = currentDate.toLocaleString('en-US', { month: 'long' });
    this.year = currentDate.getFullYear();
    this.defaultDate = currentDate.toISOString().substring(5, 7);
    this.day = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    this.getTrackedExpenses();
    this.getCategories();
    this.getIncome();
    this.runChart();
  }

  getCategories() {
    this.categoriesServiceFire.getCategories().subscribe((data) => {
      this.categories = data;
      this.getExpenses();
    });
  }

  getExpenses() {
    this.categoriesServiceFire.getExpensList().subscribe((data) => {
      this.expense = data.filter((f: any) => f.userId == this.userId);
      this.calculateExpense();
    });
  }

  getTrackedExpenses() {
    this.categoriesService.getFromLineGraph().subscribe((data) => {
      this.trackedExpenses = data as any[];
      this.calculateExpense();
    });
  }
  
  getIncome() {
    this.categoriesServiceFire.getIncomes().subscribe((data: any) => {
      this.income = data.filter((f: any) => f.userId == this.userId);
      this.thisMonthIncome = this.income.filter(
        (f) =>
          f.day.substring(5, 7) === this.defaultDate &&
          f.day.substring(0, 4) == this.year
      );
      this.incomeTotel = this.thisMonthIncome.reduce(
        (sum, val) => sum + val.amount,
        0
      );
      localStorage.setItem('income', this.incomeTotel.toString());

      this.balense = this.incomeTotel - this.expensTotel;
      this.allIncomeTotel = this.income.reduce(
        (sum, val) => sum + val.amount,
        0
      );
      this.allBalence = this.allIncomeTotel - this.allExpenseTotel;

      this.average =
        this.incomeTotel > 0
          ? Math.round((this.expensTotel * 100) / this.incomeTotel)
          : 0;
    });
  }

  calculateExpense() {
    this.expense.forEach((val) => {
      const category = this.categories.find((v) => v.id == val.catId);
      val.name = category?.name || 'Unknown';
    });

    this.thisMonthExpense = this.expense.filter(
      (f) =>
        Number(f.day.substring(5, 7)) == Number(this.defaultDate) &&
        f.day.substring(0, 4) == this.year
    );

    this.finalExpense = [];
    this.thisMonthExpense.forEach((exp) => {
      const existing = this.finalExpense.find((f) => f.name === exp.name);
      if (existing) {
        existing.expense += exp.expense;
      } else {
        this.finalExpense.push({ ...exp });
      }
    });

    this.finalExpense.sort((a, b) => b.expense - a.expense);
    this.lstThreeOfFiinalExpense = [...this.thisMonthExpense]
      .slice(-3)
      .reverse();

    this.expensTotel = this.finalExpense.reduce(
      (sum, val) => sum + val.expense,
      0
    );
    localStorage.setItem('expense', this.expensTotel.toString());

    // All expenses
    this.allExpense = [];
    this.expense.forEach((val) => {
      const existing = this.allExpense.find((f) => f.name === val.name);
      if (existing) {
        existing.expense += val.expense;
      } else {
        this.allExpense.push({ ...val });
      }
    });
    this.allExpenseTotel = this.allExpense.reduce(
      (sum, val) => sum + val.expense,
      0
    );

    this.newTrckedArray = this.trackedExpenses.map((value) => ({
      x: value.day,
      y: value.amount,
    }));

    this.runChart();
    this.groupExpensesByDate();
  }

  groupExpensesByDate() {
    const expenseMap: {
      [key: string]: {
        items: { category: string; expense: number }[];
        total: number;
      };
    } = {};

    this.thisMonthExpense.forEach((item) => {
      const category =
        this.categories.find((cat) => cat.id === item.catId)?.name ||
        'Unknown';
      if (!expenseMap[item.day]) {
        expenseMap[item.day] = { items: [], total: 0 };
      }
      expenseMap[item.day].items.push({ category, expense: item.expense });
      expenseMap[item.day].total += Number(item.expense);
    });

    this.groupedExpenses = Object.entries(expenseMap)
      .map(([date, { items, total }]) => ({
        date,
        items,
        total,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  convertDateFormat(dateStr: string): string {
    const date = new Date(dateStr);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dayOfWeek = weekdays[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const offset = date.getTimezoneOffset();
    const sign = offset >= 0 ? '-' : '+';
    const offsetH = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, '0');
    const offsetM = (Math.abs(offset) % 60).toString().padStart(2, '0');
    return `${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}:${seconds} GMT${sign}${offsetH}${offsetM}`;
  }

  calculatePercentage(expense: number): number {
    return this.expensTotel > 0
      ? Math.round((expense * 100) / this.expensTotel)
      : 0;
  }

  calculatePercentagewithIncome(expense: number): number {
    return this.incomeTotel > 0
      ? Math.round((expense * 100) / this.incomeTotel)
      : 0;
  }

  runChart() {
    this.chartOptions = {
      theme: 'light2',
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: `Monthly Expenses in ${this.month} ${this.year}`,
      },
      axisX: {
        title: 'Date',
        valueFormatString: 'DD MMM',
      },
      axisY: {
        title: 'Expense (INR)',
        labelFormatter: (e: any) => {
          const suffixes = ['', 'K', 'M', 'B', 'T'];
          let order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
          if (order > suffixes.length - 1) order = suffixes.length - 1;
          const suffix = suffixes[order];
          return '₹' + (e.value / Math.pow(1000, order)).toFixed(2) + suffix;
        },
      },
      data: [
        {
          type: 'line',
          xValueFormatString: 'DD MMM',
          yValueFormatString: '₹#,###.##',
          dataPoints: this.thisMonthExpense.map((entry) => ({
            x: new Date(entry.day),
            y: entry.expense,
          })),
        },
      ],
    };
  }
}
