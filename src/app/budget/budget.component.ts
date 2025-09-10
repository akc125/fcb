import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import {
  CanvasJSAngularChartsModule,
  CanvasJS,
} from '@canvasjs/angular-charts';
import { CategoryFireService } from 'src/services/category-fire.service';
import { FormControl, FormGroup } from '@angular/forms';
import { BudgetService } from 'src/services/budget.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
CanvasJS.addColorSet('customColorSet', [
  '#ffcb06',
  '#ce1249',
  '#3a943c',
  '#7f3e83',
  '#812900',
  '#2078b6',
  '#df7f2e',
  '#e3e3e3',
]);

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css'],
  // imports: [CommonModule, RouterOutlet, CanvasJSAngularChartsModule],
})
export class BudgetComponent {
  @ViewChild('invoice') invoiceElement!: ElementRef;
  ngOnInit(): void {
    this.getCategory();
    this.getBudget();
    this.getTotalPers();
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
    this.defualtMonth = currentDate.toISOString().substring(5, 7);
    this.defualtYear = currentDate.toISOString().substring(0, 4);
    this.defualtMonthName = new Date().toLocaleString('default', {
      month: 'long',
    });
    setInterval(() => {
      this.getPercentageOfCurrentDayInMonth();
    }, 1000);
  }
  defaultDate: any;
  defualtMonth: any;
  percentageOfTheDay: any;
  ExpOfTheDay: any;
  defualtYear: any;
  categories: any = [];
  budgets: any = [];
  categoriesSelected: any = [];
  totalExpenseByCategories: any;
  totalExpenseByExpenseAll: any;
  totalBudget: any;
  constructor(
    private BudgetService: BudgetService,
    private categoriesServiceFire: CategoryFireService
  ) {}
  currentDate = new Date();
  currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
  currentYear: any = this.currentDate.getFullYear(); // e
  budgetFormGroup = new FormGroup({
    name: new FormControl(),
    amount: new FormControl(),
    date: new FormControl(),
  });
  currentDay: any;
  getPercentageOfCurrentDayInMonth(): number {
    const now = new Date();
    const currentDay = now.getDate();
    this.currentDay = currentDay;
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0
    );
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const secondsPassed = (now.getTime() - startOfMonth.getTime()) / 1000;
    const totalSeconds = (endOfMonth.getTime() - startOfMonth.getTime()) / 1000;

    const percentage = (secondsPassed / totalSeconds) * 100;

    const prc = this.prive ? 100 : percentage;
    this.ExpOfTheDay = parseFloat(((this.totalBudget * prc) / 100).toFixed(2));
    this.percentageOfTheDay = parseFloat(prc.toFixed(2));
    return this.percentageOfTheDay;
  }

  public generatePDF(): void {
    html2canvas(this.invoiceElement.nativeElement, { scale: 1.5 }).then(
      (canvas) => {
        const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
        const fileWidth = 200;
        const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
        let PDF = new jsPDF('p', 'mm', 'a4');
        PDF.addImage(
          imageGeneratedFromTemplate,
          'PNG',
          5,
          5,
          fileWidth,
          generatedImageHeight
        );
        PDF.html(this.invoiceElement.nativeElement.innerHTML);
        PDF.save(`Budget report ${this.currentMonth} ${this.currentYear}`);
      }
    );
  }
  defualtMonthName: any;
  expense: any = []; // Assuming budgets is an array
  currentMonthFl: any;
  prive: any = false;
  changeMonthToPreve(): void {
    this.prive = true;
    const dfltm = Number(this.defualtMonth) - 1;
    const prevMonth = dfltm > 0 ? dfltm : 12;
    const prevMonthFormatted = prevMonth.toString().padStart(2, '0');
    const monthName = new Date(0, prevMonth - 1).toLocaleString('default', {
      month: 'long',
    });
    this.defualtMonth = prevMonthFormatted;
    if (this.defualtMonth == '12') {
      this.defualtYear = this.defualtYear - 1;
    }

    this.defualtMonthName = monthName;
    this.getExpenses();
    this.getBudget();
  }
  switchToCurrent() {
    this.prive = false;
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
    this.defualtMonth = currentDate.toISOString().substring(5, 7);
    this.defualtYear = currentDate.toISOString().substring(0, 4);
    this.defualtMonthName = '';
    this.defualtMonthName = new Date().toLocaleString('default', {
      month: 'long',
    });
    this.getExpenses();
    this.getBudget();
  }
  getBudget() {
    const id = localStorage.getItem('userId');
    this.BudgetService.getBudgets().subscribe((data: any) => {
      this.budgets = data.filter((f: any) => {
        return (
          f.userId === id &&
          f.date.substring(5, 7) === this.defualtMonth &&
          f.date.substring(0, 4) === this.defualtYear.toString()
        );
      });
      const currentDate = new Date();
      let defualtMonth = currentDate.toISOString().substring(5, 7);
      let defualtYear = currentDate.toISOString().substring(0, 4);
      if (this.budgets.length == 0) {
        this.budgets = data.filter((f: any) => {
          return (
            f.userId === id &&
            f.date.substring(5, 7) === defualtMonth &&
            f.date.substring(0, 4) === defualtYear.toString()
          );
        });
      }
      this.createNewBudgetArray();
      this.getBudgetPers();
      this.addSelectedCategoriesFromBudgetArray();
      this.getExpenses();
    });
  }

  categoriesIdFromBudgetData: any = [];
  addSelectedCategoriesFromBudgetArray() {
    for (let val of this.budgets) {
      for (let item of val.categories) {
        this.categoriesIdFromBudgetData.push(item);
      }
    }
  }
  createNewBudgetArray() {
    let total = 0;
    for (let val of this.budgets) {
      total += Number(val.amount);
    }
    this.totalBudget = total;
    for (let val of this.budgets) {
      val.pers = Math.round((val.amount * 100) / total);
    }
    setTimeout(() => {
      this.getBudgetPers();
    }, 1000);
    this.getPercentageOfCurrentDayInMonth();
  }

  getCategory() {
    const id = localStorage.getItem('userId');
    this.BudgetService.getCategories().subscribe((data: any) => {
      this.categories = data.filter((f: any) => f.userId === id);
    });
  }
  addSelectedCategory(id: any) {
    for (let val of this.categories) {
      const exist = val.id == id;
      if (exist) {
        this.categoriesSelected.push(val);
      }
    }
    this.categoriesSelectedIds = [];
    for (let val of this.categoriesSelected) {
      const exist = this.categoriesSelectedIds.includes(val.id);
      if (!exist) {
        this.categoriesSelectedIds.push(val.id);
      }
    }
  }
  categoriesSelectedIds: any = [];
  saveForm() {
    for (let val of this.categoriesSelected) {
      const exist = this.categoriesSelectedIds.includes(val.id);
      if (!exist) {
        this.categoriesSelectedIds.push(val.id);
      }
    }
    const ans = this.budgetFormGroup.value;
    const data = { ...ans, categories: this.categoriesSelectedIds };
    this.BudgetService.postBudget(data).then((data) => {
      this.budgetFormGroup.setValue({ amount: '', name: '', date: '' });
      this.categoriesSelected = [];
      this.getCategory();
      this.getExpenses();
      this.open = false;
    });
  }
  removeSelectedCategory(id: any) {
    this.categoriesSelectedIds = [];
    this.categoriesSelectedIds = this.categoriesSelectedIds.filter(
      (f: any) => f !== id
    );
    this.categoriesSelected = this.categoriesSelected.filter(
      (f: any) => f.id !== id
    );
    this.categoriesIdFromBudgetData = this.categoriesIdFromBudgetData.filter(
      (f: any) => f !== id
    );
  }

  EditForm(amt: any) {
    this.categoriesSelectedIds = [];
    for (let val of this.categoriesSelected) {
      const exist = this.categoriesSelectedIds.includes(val.id);
      if (!exist) {
        this.categoriesSelectedIds.push(val.id);
      }
    }
    const ans = this.budgetFormGroup.value;
    const currentAmount = this.budgetFormGroup.get('amount')?.value;
    const  balance  = amt - currentAmount;
    const calc=balance+currentAmount
    const final = {
      ...ans,
      amount: currentAmount < amt ? calc : currentAmount,
    };
    const data = {
      ...final,
      categories: this.categoriesSelectedIds,
      id: this.documentId,
    };
    console.log('dataaaa',amt, data,this.documentId,amt,currentAmount,balance,calc);
    this.BudgetService.EditBudget(data).then((data: any) => {
      this.budgetFormGroup.setValue({ amount: '', name: '', date: '' });
      this.categoriesSelected = [];
      this.getCategory();
      this.getExpenses();
      this.open = false;
    });
  }

  documentId: any;
  deleteBudget() {
    let confirm = window.confirm('do you wnt to delete');
    if (confirm) {
      this.BudgetService.deleteBudget(this.documentId).then((data) => {
        this.getBudget();
        this.getExpenses();
        this.categoriesIdFromBudgetData = [];
        this.categoriesSelected = [];
        this.budgetFormGroup.setValue({ amount: '', name: '', date: '' });
        this.open = false;
      });
    }
  }
  open: any = false;
  openForm() {
    this.open = true;
    this.mode = 'ADD';
    this.addSelectedCategoriesFromBudgetArray();
    this.budgetFormGroup.setValue({
      amount: '',
      name: '',
      date: this.defaultDate,
    });
    this.categoriesSelected = [];
    this.categoriesSelectedIds = [];
  }
  closeForm() {
    this.open = false;
    // this.budgetFormGroup.setValue({ amount: '', name: '', date: '' });
    this.categoriesSelected = [];
    this.categoriesSelectedIds = [];
    this.getBudget();
    this.getCategory();
  }
  mode: any;
  editedBudgetCategoriesIds: any = [];
  editMode(value: any) {
    this.categoriesSelected = [];
    this.documentId = value.id;
    this.open = true;
    this.mode = 'EDIT';
    this.budgetFormGroup.setValue({
      name: value.name,
      amount: value.amount,
      date: value.date,
    });
    for (let val of this.categories) {
      const exist = value.categories.includes(val.id);
      if (exist) {
        this.categoriesSelected.push(val);
      }
    }
  }

  getExpenses() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getExpensList().subscribe((data) => {
      this.expense = JSON.parse(JSON.stringify(data)).filter((f: any) => {
        return (
          f.userId === id &&
          f.day.substring(5, 7) === this.defualtMonth &&
          f.day.substring(0, 4) === this.defualtYear.toString()
        );
      });
      this.calculateExpense();
      this.calculateExpenseForBudget();
    });
  }
  firstPartTotal: any;
  secondPartTotal: any;
  thirdPartTotal: any;

  calculateExpense() {
    var totalA = 0;
    for (let val of this.expense) {
      totalA += Number(val.expense);
    }
    this.totalExpenseByExpenseAll = totalA;
    // const currentDay = now.getDate();
    let firstPart = this.expense.filter((f: any) => {
      return new Date(f.day).getDate() < 8;
    });
    let secondPart = this.expense.filter((f: any) => {
      return new Date(f.day).getDate() < 16;
    });
    let thirdPart = this.expense.filter((f: any) => {
      return new Date(f.day).getDate() < 24;
    });

    var total = 0;
    for (let val of firstPart) {
      total += Number(val.expense);
    }
    this.firstPartTotal = total;

    var total2 = 0;
    for (let val of secondPart) {
      total2 += Number(val.expense);
    }
    this.secondPartTotal = total2;

    var total3 = 0;
    for (let val of thirdPart) {
      total3 += Number(val.expense);
    }
    this.thirdPartTotal = total3;
  }
  calculateExpenseForBudget() {
    this.budgets = this.budgets.map((val: any) => {
      const budgetExpense = this.expense
        .filter((item: any) => val.categories.includes(item.catId))
        .reduce((sum: number, item: any) => sum + Number(item.expense), 0);

      return {
        ...val,
        expense: budgetExpense, // Assign total expense for this budget
      };
    });
    this.calculateExpenseFromBudget();
    this.getTotalPers();
    this.renderChart();
    this.budgetMismatch();
  }
  calculateExpenseFromBudget() {
    var total = 0;
    for (let val of this.budgets) {
      total += Number(val.expense);
    }
    this.totalExpenseByCategories = total;
    this.getTotalPers();
  }
  expperceBudget: any;
  chartOptions: any;
  getBudgetPers() {
    const dynamicDataPoints = this.budgets.map((item: any) => ({
      y: Number(item.pers),
      name: item.name,
    }));
    this.chartOptions = {
      animationEnabled: true,
      theme: 'dark',
      colorSet: 'customColorSet',
      data: [
        {
          type: 'doughnut',
          indexLabel: '{name}: {y}',
          innerRadius: '70%',
          yValueFormatString: "#,##0.00'%'",
          dataPoints: dynamicDataPoints,
        },
      ],
    };
  }
  totalDta = [
    { y: 234, name: 'exp' },
    { y: 134, name: 'budg' },
  ];
  chartOptions2: any;
  getTotalPers() {
    const pers = Math.round(
      (this.totalExpenseByCategories * 100) / this.totalBudget
    );
    this.expperceBudget = pers;
    const budg = 100 - pers;
    const colors = ['#3357FF', '#F1C40F'];
    const BudgetExpens = [
      {
        y: budg,
        name: `Budget ${budg}%`,
      },
      {
        y: Number(pers),
        name: `Expense ${pers}%`,
      },
    ].map((item, index) => ({
      ...item,
      color: colors[index % colors.length], // Cycle through the colors
    }));
    this.chartOptions2 = {
      animationEnabled: true,
      title: {
        text: 'Total Budget Movement',
        fontWeight: 'none',
        fontSize: 34,
      },
      data: [
        {
          type: 'doughnut',
          yValueFormatString: "#,###.##'%'",
          indexLabel: '{name}',
          dataPoints: BudgetExpens,
        },
      ],
    };
  }
  chart: any;
  mismatches: any = [];
  budgetMismatch() {
    // for (let val of this.budgets) {
    //   if (val.amount < val.expense) {
    //     this.editMode(val);
    //     setTimeout(() => {
    //     this.EditForm(val.expense);
    //     }, 5000);
    //   }
    // }
    // console.log('mismates', this.mismatches, this.budgets);
  }
  renderChart(): void {
    const labels = this.budgets.map((item: any) => item.name);
    const budgets = this.budgets.map((item: any) => item.amount);
    const expenses = this.budgets.map((item: any) => item.expense);
    console.log('mismates', this.mismatches, this.budgets);
    if (this.chart) {
      this.chart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Budget',
            data: budgets,
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Light Green
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Expense',
            data: expenses,
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Light Red
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const datasetIndex = context.datasetIndex;
                const value = context.raw; // Current value (Budget or Expense)
                const budget = budgets[context.dataIndex];
                if (datasetIndex === 1) {
                  // Expense dataset
                  const percentage = ((value / budget) * 100).toFixed(2);
                  return `${context.dataset.label}: ${value} (${percentage}%)`;
                }
                return `${context.dataset.label}: ${value}`;
              },
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: `Categories Expense ${
                this.totalExpenseByExpenseAll
              } remaining  ${
             
                   this.totalBudget- this.totalExpenseByExpenseAll 
            
              }`,
            },
          },
          y: {
            title: {
              display: true,
              text: `Budget ${this.totalBudget}`,
            },
            beginAtZero: true,
          },
        },
      },
    };

    const chartElement = document.getElementById(
      'barChart'
    ) as HTMLCanvasElement;
    if (chartElement) {
      this.chart = new Chart(chartElement, config);
    } else {
      console.error('Canvas element with id "barChart" not found.');
    }
  }
  getFormattedDateFromPercentage(percentage: number): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    const totalDays = new Date(year, month + 1, 0).getDate();
    const day = Math.round((percentage / 100) * totalDays);

    const targetDate = new Date(year, month, day);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // e.g., Wed
      month: 'long', // e.g., April
      day: 'numeric', // e.g., 24
      year: 'numeric', // e.g., 24
    };

    return targetDate.toLocaleDateString('en-US', options); // "Wed, April 24"
  }
  getDaysToReachPercentageDate(percentage: number): number {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const totalDays = new Date(year, month + 1, 0).getDate();
    const day = Math.round((percentage / 100) * totalDays);
    const targetDate = new Date(year, month, day);

    // Reset time to 00:00:00 for clean difference
    const todayStart = new Date(year, month, today.getDate());
    const diffInMs = targetDate.getTime() - todayStart.getTime();

    const daysDiff = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return daysDiff;
  }

  getDateColor(percentage: number): string {
    const days = this.getDaysToReachPercentageDate(percentage);

    if (days >= 10) return 'red';
    else if (days >= 5) return 'Purple';
    else if (days >= 3) return 'orange'; // Yellowish
    else if (days >= 1) return 'green';
    else return 'gray'; // Maybe for today or past
  }
  getWarningText(percentage: number): string {
    const days = this.getDaysToReachPercentageDate(percentage);

    if (days >= 10) {
      return 'High spending risk ahead. Please stop unnecessary expenses.';
    } else if (days >= 5) {
      return 'You’re approaching your limit. Limit your spending now.';
    } else if (days >= 3) {
      return 'Watch your spending. Keep it in check.';
    } else if (days >= 1) {
      return 'You’re doing good. Keep tracking your expenses.';
    } else {
      return 'Spending is beyond safe zone. Review your budget immediately.';
    }
  }
}
