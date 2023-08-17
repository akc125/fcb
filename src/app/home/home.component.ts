import { CategoriesService } from "src/services/categories.service";
import { Component } from "@angular/core";
import { CanvasJS } from "@canvasjs/angular-charts";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  defaultDate: any;
  month: any;
  year: any;
  day: any;
  ngOnInit(): void {
    this.getTrackedExpenses();
    this.getExpenses();
    this.getIncome();
    const currentDate = new Date();
    this.month = currentDate.toLocaleString("en-US", { month: "long" });
    this.year = currentDate.getFullYear();
    this.defaultDate = currentDate.toISOString().substring(5, 7);
    const days = new Date();
    this.day = days.toISOString().slice(0, 19).replace("T", " ");
    this.initializeChart();
  }
  constructor(private categoriesService: CategoriesService) {}
  userId = localStorage.getItem("userId");
  finalExpense: any = [];
  expense: any = [];
  thisMonthExpense: any = [];
  thisMonthIncome: any = [];
  expensTotel: number = 0;
  income: any = [];
  incomeTotel: number = 0;
  balense: number = 0;
  average: number = 0;
  initializeChart() {
    // Create the chart and pass chartOptions
    this.chart = new CanvasJS.Chart("chartContainer", this.chartOptions);
    this.chart.render(); // Render the chart
  }
  getExpenses() {
    const id = localStorage.getItem("userId");
    this.categoriesService.getExpensList().subscribe((data) => {
      this.expense = JSON.parse(JSON.stringify(data)).filter((f: any) => {
        return f.userId == id;
      });

      this.calculateExpense();
    });
  }
  allExpense: any = [];
  allIncome: any = [];
  allExpenseTotel: number = 100;
  allIncomeTotel: number = 0;
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
    const inputDate = new Date(dateStr);
    const day = inputDate.getUTCDate();
    const month = inputDate.getUTCMonth() + 1;
    const year = inputDate.getUTCFullYear();

    return `${year}, ${month}, ${day}`;
  }
  calculateExpense() {
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
    }
    for (const exp of this.finalExpense) {
      this.expensTotel += exp.expense;
    }

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
      this.newTrckedArray.push({ x: new Date(value.day), y: value.amount });
    }

    // Update dataPoints arrays

    const lastElement = this.trackedExpenses[this.trackedExpenses.length - 1];
    console.log("lastElement", lastElement?.amount, this.expensTotel);
    if (
      Number(this.expensTotel) !== Number(lastElement?.amount) &&
      this.expensTotel !== 0
    ) {
      console.log("Condition met");
      this.tackExpenseTotel({
        amount: this.expensTotel,
        day: this.day,
      });
    } else {
      console.log("Condition not met");
    }
    console.log(
      "this.trackedExpenses",

      this.newTrckedArray
    );
  }

  tackExpenseTotel(data: any) {
    console.log(data);
    this.categoriesService.postForLineGraph(data).subscribe((data) => {
      alert("added successfully");
      // this.charting()
    });
  }

  getIncome() {
    const id = localStorage.getItem("userId");
    this.categoriesService.getIncomes().subscribe((data: any) => {
      this.income = data.filter((f: any) => f.userId == id);
      const incomCopy = [...this.income];
      this.thisMonthIncome = incomCopy.filter(
        (f: any) => f.day.substring(5, 7) === this.defaultDate
      );
      for (const inc of this.thisMonthIncome) {
        this.incomeTotel += inc.amount;
      }
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
    { x: new Date(2023, 7, 14), y: 4632 },
    { x: new Date(2023, 7, 15), y: 4632 },
    { x: new Date(2023, 7, 16), y: 4632 },
    { x: new Date(2023, 7, 17), y: 4632 },
    { x: new Date(2023, 7, 18), y: 4632 },
  ];

  chart: any;
  chartOptions = {
    theme: "light2",
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: "Market Capitalization of ACME Corp",
    },
    axisY: {
      labelFormatter: (e: any) => {
        return e.value.toFixed(0);
      },
    },
    data: [
      {
        type: "line",
        name: "Series 1",
        xValueFormatString: "ddd MMM DD YYYY", // Match the format of your date strings
        yValueFormatString: "#,###.##",
        dataPoints: this.newTrckedArray,
      },
      {
        type: "line",
        name: "Series 2",
        xValueFormatString: "DD",
        lineColor: "red",
        yValueFormatString: "#,###.##",
        dataPoints:this.newTrckedArray
        // dataPoints: [
        //   { x: new Date(2023, 7, 13), y: 500 },
        //   { x: new Date(2023, 7, 14), y: 1500 },
        //   { x: new Date(2023, 7, 15), y: 2800 },
        //   { x: new Date(2023, 7, 16), y: 420 },
        //   { x: new Date(2023, 7, 17), y: 600 },
        //   { x: new Date(2023, 7, 18), y: 1100 },
        //   { x: new Date(2023, 7, 19), y: 2300 },
        //   { x: new Date(2023, 7, 20), y: 6400 },
        // ]
      },
    ],
  };
}
