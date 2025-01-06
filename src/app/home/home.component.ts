import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { CanvasJS } from '@canvasjs/angular-charts';
import * as moment from 'moment';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  defaultDate: any;
  month: any;
  year: any;
  day: any;
  ngOnInit(): void {
    // this.change()
    this.getTrackedExpenses();
    this.getCategories();
    this.getIncome();
    const currentDate = new Date();
    this.month = currentDate.toLocaleString('en-US', { month: 'long' });
    this.year = currentDate.getFullYear();
    this.defaultDate = currentDate.toISOString().substring(5, 7);
    const days = new Date();
    this.day = days.toISOString().slice(0, 19).replace('T', ' ');
    this.runChart();
  }
  constructor(
    private categoriesService: CategoriesService,
    private categoriesServiceFire: CategoryFireService
  ) {}
  userId = localStorage.getItem('userId');
  finalExpense: any = [];
  lstThreeOfFiinalExpense: any = [];
  expense: any = [];
  thisMonthExpense: any = [];
  thisMonthIncome: any = [];
  expensTotel: any = 0;
  income: any = [];
  incomeTotel: any = 0;
  balense: any = 0;
  average: number = 0;

  getExpenses() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getExpensList().subscribe((data) => {
      this.expense = JSON.parse(JSON.stringify(data)).filter((f: any) => {
        return f.userId == id;
      });

      this.calculateExpense();
    });
  }
  allExpense: any = [];
  allIncome: any = [];
  allExpenseTotel: any = 0;
  allIncomeTotel: any = 0;
  allBalence: number = 0;
  trackedExpenses: any = [];
  newTrckedArray: any[] = [];
  getTrackedExpenses() {
    this.categoriesService.getFromLineGraph().subscribe((data) => {
      this.trackedExpenses = data;

      this.calculateExpense();
    });
  }

  convertDateFormat(dateStr: any) {
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

    // Get the time zone offset in hours and minutes
    const timeZoneOffset = date.getTimezoneOffset();
    const timeZoneOffsetHours = Math.floor(Math.abs(timeZoneOffset) / 60)
      .toString()
      .padStart(2, '0');
    const timeZoneOffsetMinutes = (Math.abs(timeZoneOffset) % 60)
      .toString()
      .padStart(2, '0');
    const timeZoneSign = timeZoneOffset >= 0 ? '-' : '+';

    return `${dayOfWeek} ${month} ${day} ${year} ${hours}:${minutes}:${seconds} GMT${timeZoneSign}${timeZoneOffsetHours}${timeZoneOffsetMinutes}`;
  }
  categories:any=[]
  getCategories() {
    this.categoriesServiceFire.getCategories().subscribe((data) => {
      this.categories = data;
      console.log('categories',data)
    });
    this.getExpenses();
  }
 
  calculateExpense() {
    for (let val of this.expense) {
      for (let v of this.categories) {
        if (val.catId == v.id) {
          val.name = v.name;
        }
      }
    }
    const MonthExpenseCopy = JSON.parse(JSON.stringify(this.expense));
    this.thisMonthExpense = MonthExpenseCopy.filter(
      (f: any) =>
        Number(f.day.substring(5, 7)) == Number(this.defaultDate) &&
        f.day.substring(0, 4) == this.year
    );

    for (const exp of this.thisMonthExpense) {
      const existing = this.finalExpense.find((f: any) => f.name === exp.name);
      if (existing) {
        existing.expense += exp.expense;
      } else {
        this.finalExpense.push(exp);
      }
      this.finalExpense = this.finalExpense.sort(
        (a: any, b: any) => b.expense - a.expense
      );
      this.lstThreeOfFiinalExpense = this.expense.slice(-3).reverse();
    }
    for (const exp of this.finalExpense) {
      this.expensTotel += exp.expense;
    }
    localStorage.setItem('expense', this.expensTotel);
    // all expense
    const ExpenseCopy = JSON.parse(JSON.stringify(this.expense));
    for (const val of ExpenseCopy) {
      const existing = this.allExpense.find((f: any) => f.name === val.name);
      if (existing) {
        existing.expense += val.expense;
      } else {
        this.allExpense.push(val);
      }
    }
    for (const val of this.allExpense) {
      this.allExpenseTotel += val.expense;
    }
    for (let value of this.trackedExpenses) {
      value.x = this.convertDateFormat(value.day);
      value.y = value.amount;
    }
    for (const value of this.trackedExpenses) {
      this.newTrckedArray.push({ x: value.day, y: value.amount });
    }

    // Update dataPoints arrays
    const lastElement = this.trackedExpenses[this.trackedExpenses.length - 1];

    // this.thisMonthExpense = this.thisMonthExpense.map((p: any) => {
    //   return {
    //     ...p,
    //     day: new Date(p.day).toString(),
    //   };
    // });
    // console.log('thisMonthExpense', aft);
    if (
      Number(this.expensTotel) !== Number(lastElement?.amount) &&
      this.expensTotel !== 0
    ) {
      console.log('Condition met');
      this.tackExpenseTotel({
        amount: this.expensTotel,
        day: this.day,
      });
    } else {
      console.log('Condition not met');
    }
    console.log(
      'this.trackedExpenses',

      this.trackedExpenses,
      'this.NewtrackedExpenses',
      this.newTrckedArray
    );
    this.runChart()
  }

  tackExpenseTotel(data: any) {
    // console.log(data);
    // this.categoriesService.postForLineGraph(data).subscribe((data) => {
    //   alert("added successfully");
    //   // this.charting()
    // });
  }

  getIncome() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getIncomes().subscribe((data: any) => {
      this.income = data.filter((f: any) => f.userId == id);
      const incomCopy = [...this.income];
      this.thisMonthIncome = incomCopy.filter(
        (f: any) => f.day.substring(5, 7) === this.defaultDate
      );
      for (const inc of this.thisMonthIncome) {
        this.incomeTotel += inc.amount;
      }
      localStorage.setItem('income', this.incomeTotel);
      this.balense = this.incomeTotel - this.expensTotel;
      // all income
      for (const val of this.income) {
        this.allIncomeTotel += val.amount;
      }

      this.allBalence = this.allIncomeTotel - this.allExpenseTotel;

      this.average = Math.round((this.expensTotel * 100) / this.incomeTotel);
    });
  }
  calculatePercentage(expense: number) {
    return Math.round((expense * 100) / this.expensTotel);
  }
  calculatePercentagewithIncome(expense: number) {
    if (this.incomeTotel > 0) {
      return Math.round((expense * 100) / this.incomeTotel);
    } else {
      return 0;
    }
  }
  mydata = [
    { x: '2023-08-13T15:53:47.018Z', y: 4632 },
    { x: '2023-08-14T15:53:47.018Z', y: 4732 },
    { x: '2023-08-15T15:53:47.018Z', y: 5632 },
    { x: '2023-08-13T15:53:47.018Z', y: 6632 },
    { x: '2023-08-13T15:53:47.018Z', y: 7632 },
  ];

  change() {
    const sd = new Date(2023, 7, 14);
  }

  chart: any;
  chartOptions:any;
  runChart(){

  
  this.chartOptions = {
    theme: 'light2',
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: 'Monthly Expenses in January 2021',
    },
    axisX: {
      title: 'Date',
      valueFormatString: 'DD MMM',
    },
    axisY: {
      title: 'Expense (INR)',
      labelFormatter: (e: any) => {
        var suffixes = ['', 'K', 'M', 'B', 'T'];

        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1) order = suffixes.length - 1;

        var suffix = suffixes[order];
        return '₹' + e.value / Math.pow(1000, order) + suffix;
      },
    },
    data: [
      {
        type: 'line',
        xValueFormatString: 'DD MMM',
        yValueFormatString: '₹#,###.##',
        // dataPoints: [
        //   { x: new Date(2021, 0, 1), y: 40 },
        //   { x: new Date(2021, 1, 1), y: 42 },
        //   { x: new Date(2021, 2, 1), y: 50 },
        //   { x: new Date(2021, 3, 1), y: 62 },
        //   { x: new Date(2021, 4, 1), y: 72 },
        //   { x: new Date(2021, 5, 1), y: 80 },
        //   { x: new Date(2021, 6, 1), y: 85 },
        //   { x: new Date(2021, 7, 1), y: 84 },
        //   { x: new Date(2021, 8, 1), y: 76 },
        //   { x: new Date(2021, 9, 1), y: 64 },
        //   { x: new Date(2021, 10, 1), y: 54 },
        //   { x: new Date(2021, 11, 1), y: 44 }
        // ]

        dataPoints: this.thisMonthExpense.map((entry: any) => {
          console.log('Original entry.day:', entry.day,entry.expense);
          const date = new Date(entry.day);  // Ensure `entry.day` is a Date object
          return {
            x: entry.day, // Valid Date object
            y: entry.expense,
          };
        }),
      },
    ],
  };}
}
