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
    this.getExpenses();
    this.getTotalPers();
    this.renderChart();
  }
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
   currentYear = this.currentDate.getFullYear(); // e
  budgetFormGroup = new FormGroup({
    name: new FormControl(),
    amount: new FormControl(),
  });
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
  getBudget() {
    const id = localStorage.getItem('userId');
    this.BudgetService.getBudgets().subscribe((data: any) => {
      this.budgets = data.filter((f: any) => f.userId === id);
      this.createNewBudgetArray();
      this.getBudgetPers();
      this.addSelectedCategoriesFromBudgetArray();
      console.log('bdgt', this.budgets);
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
      this.budgetFormGroup.setValue({ amount: '', name: '' });
      this.categoriesSelected = [];
      this.getCategory();
      this.getExpenses();
      this.open = false;
    });
  }
  removeSelectedCategory(id: any) {
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

  EditForm() {
    for (let val of this.categoriesSelected) {
      const exist = this.categoriesSelectedIds.includes(val.id);
      if (!exist) {
        this.categoriesSelectedIds.push(val.id);
      }
    }
    const ans = this.budgetFormGroup.value;
    const data = {
      ...ans,
      categories: this.categoriesSelectedIds,
      id: this.documentId,
    };
    this.BudgetService.EditBudget(data).then((data: any) => {
      this.budgetFormGroup.setValue({ amount: '', name: '' });
      this.categoriesSelected = [];
      this.getCategory();
      this.getExpenses();
      this.open = false;
    });
  }

  documentId: any;
  deleteBudget() {
    this.BudgetService.deleteBudget(this.documentId).then((data) => {
      this.getBudget();
      this.getExpenses();
      this.categoriesIdFromBudgetData = [];
      this.categoriesSelected = [];
      this.budgetFormGroup.setValue({ amount: '', name: '' });
      this.open = false;
    });
  }
  open: any = false;
  openForm() {
    this.open = true;
    this.mode = 'ADD';
    this.addSelectedCategoriesFromBudgetArray();
    this.budgetFormGroup.setValue({ amount: '', name: '' });
    this.categoriesSelected = [];
    this.categoriesSelectedIds = [];
  }
  closeForm() {
    this.open = false;
    this.budgetFormGroup.setValue({ amount: '', name: '' });
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
    });
    for (let val of this.categories) {
      const exist = value.categories.includes(val.id);
      if (exist) {
        this.categoriesSelected.push(val);
      }
    }
  }
  expense: any = []; // Assuming budgets is an array

  getExpenses() {
    const id = localStorage.getItem('userId');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.categoriesServiceFire.getExpensList().subscribe((data) => {
      this.expense = JSON.parse(JSON.stringify(data)).filter((f: any) => {
        const expenseDate = new Date(f.day);
        return (
          f.userId === id &&
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });
      this.calculateExpense();
      this.calculateExpenseForBudget();
    });
  }
  calculateExpense() {
    var total = 0;
    for (let val of this.expense) {
      total += Number(val.expense);
    }
    this.totalExpenseByExpenseAll = total;
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
  }
  calculateExpenseFromBudget() {
    var total = 0;
    for (let val of this.budgets) {
      total += Number(val.expense);
    }
    this.totalExpenseByCategories = total;
    console.log('calculateExpense', total, this.budgets);
    this.getTotalPers();
  }

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
          innerRadius: '90%',
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



  renderChart(): void {
    const labels = this.budgets.map((item: any) => item.name);
    const budgets = this.budgets.map((item: any) => item.amount);
    const expenses = this.budgets.map((item: any) => item.expense);
  
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
                if (datasetIndex === 1) { // Expense dataset
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
              text: 'Categories',
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
  
    const chartElement = document.getElementById('barChart') as HTMLCanvasElement;
    if (chartElement) {
      this.chart = new Chart(chartElement, config);
    } else {
      console.error('Canvas element with id "barChart" not found.');
    }
  }
  
}
