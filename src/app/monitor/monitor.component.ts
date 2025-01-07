import { CategoriesService } from 'src/services/categories.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent {
  @ViewChild('invoice') invoiceElement!: ElementRef;
  defualtDate: any;
  currentYear: any = '2024';
  currentMonth: any;

  ngOnInit(): void {
    this.setCurrentValues();
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.defualtDate = currentDate.toISOString().substring(5, 7);
    this.currentMonth = new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(currentDate);
    this.getCategories();
    this.getIncomes();
    this.passId();
    setTimeout(() => {
      this.getExpensePercentage();
    }, 2000);
  }
  constructor(
    private categoriesService: CategoriesService,
    private categoriesServiceFire: CategoryFireService
  ) {}
  selection: any;
  onSelected(event: any) {
    this.selection = event.target.value;
    this.getExpense();
    this.getIncomes();
    this.passId();
  }
  allTimeExpense: any = [];
  allTimeExpenseTotal: number = 0;
  allTimeExpenseBalance: number = 0;
  allTimeIncome: number = 0;
  expenses: any = [];
  expensesByYear: any = [];
  expensesAllTime: any = [];
  expensesJulay: any = [];
  incomes: any = [];
  incomesJulay: any = [];
  totalIncomeJulay: number = 0;
  finalExpenseJulay: any = [];
  totalExpJulay: number = 0;
  balenceJulay: number = 0;

  yearlyExpense: any = [];
  yearlyExpenseFinal: any = [];
  yearlySelectedExpense: any = [];
  yearlyExpenseTotel: any = [];
  yearlyIncome: any = [];
  yearlyIncomeTotel: number = 0;
  yearlyBalence: number = 0;

  monthsList = [
    { id: '0', name: '' },
    { id: '01', name: 'January' },
    { id: '02', name: 'February' },
    { id: '03', name: 'March' },
    { id: '04', name: 'April' },
    { id: '05', name: 'May' },
    { id: '06', name: 'June' },
    { id: '07', name: 'July' },
    { id: '08', name: 'August' },
    { id: '09', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' },
  ];

  monthSelected: any;
  monthId: any = 1;
  sum: number = 0;
  calculateTotal() {
    var total = 0;
    for (let val of this.yearlySelectedExpense) {
      total += Number(val.expense);
      this.sum = total;
    }
  }
  selectExpense(obj: any) {
    const exist = this.yearlySelectedExpense?.find((f: any) => f.id == obj.id);
    if (!exist) {
      this.yearlySelectedExpense.push(obj);
    }
    this.calculateTotal();
  }
  removeItem(val: any) {
    this.yearlySelectedExpense.splice(val, 1);
    this.calculateTotal();
  }
  coloselection() {
    this.yearlySelectedExpense = [];
  }
  prevMonthId: string = '';

  selectedMonth(event: any) {
    this.monthSelected = event.target.value;
    const selected = this.monthsList.find(
      (f: any) => f.name === this.monthSelected
    );
    this.monthId = selected?.id;
    this.monthId = selected?.id || '';

    let prevMonth = (parseInt(this.monthId) - 1).toString().padStart(2, '0');
    if (prevMonth === '00') {
      prevMonth = '12';
    }
    this.prevMonthId = prevMonth;
    console.log('prevMonthId', this.prevMonthId);
    this.getCategories();
    this.getExpense();
    this.getIncomes();
    this.passId();
  }
  selectedYear: any = 2023;
  idOfMonth: any;
  setCurrentValues(): void {
    const currentDate = new Date();
    this.selection = currentDate.getFullYear().toString(); // Get current year as a string
    this.idOfMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get current month and pad with leading zero if needed
  }
  passId() {
    this.selectedYear = this.selection ? this.selection : this.currentYear;
    this.idOfMonth = this.monthId;
    console.log('property', this.finalExpenseJulay);
  }
  userId = localStorage.getItem('userId');
  categories: any = [];
  getCategories() {
    this.categoriesServiceFire.getCategories().subscribe((data) => {
      this.categories = data;
      console.log('categories', data);
    });
    this.getExpense();
  }

  getExpense() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getExpensList().subscribe((data) => {
      this.expenses = JSON.parse(JSON.stringify(data)).filter((f: any) => {
        return f.userId == id;
      });
      this.expensesByYear = JSON.parse(JSON.stringify(data)).filter(
        (f: any) => {
          return f.userId == id;
        }
      );
      this.expensesAllTime = JSON.parse(JSON.stringify(data)).filter(
        (f: any) => {
          return f.userId == id;
        }
      );
      this.calculateExpense();
    });
    setTimeout(() => {
      this.getExpensePercentage();
    }, 1000);
  }

  calculateExpense() {
    for (let val of this.expenses) {
      for (let v of this.categories) {
        if (val.catId == v.id) {
          val.name = v.name;
        }
      }
    }
    const MonthExpenseCopy = JSON.parse(JSON.stringify(this.expenses));
    this.expensesJulay = MonthExpenseCopy.filter(
      (f: any) =>
        Number(f.day.substring(5, 7)) == parseInt(this.idOfMonth) &&
        f.day.substring(0, 4) === this.selectedYear
    );

    this.finalExpenseJulay = [];
    for (const exp of this.expensesJulay) {
      const existing = this.finalExpenseJulay.find(
        (f: any) => f.name === exp.name
      );
      if (existing) {
        existing.expense += Number(exp.expense);
      } else {
        this.finalExpenseJulay.push(exp);
      }
    }
    console.log('finalExpenseJulay', this.finalExpenseJulay);
    this.totalExpJulay = 0;
    this.totalIncomeJulay = 0;
    this.finalExpenseJulay.sort((a: any, b: any) => b.expense - a.expense);
    for (const val of this.finalExpenseJulay) {
      this.totalExpJulay += val.expense;
    }

    // year
    this.yearlyExpenseFinal = [];
    const yearlyExpenseCopys = JSON.parse(JSON.stringify(this.expenses));
    this.yearlyExpense = yearlyExpenseCopys.filter(
      (f: any) => f.day.substring(0, 4) == this.selectedYear
    );
    for (let exp of this.yearlyExpense) {
      const existing = this.yearlyExpenseFinal.find(
        (f: any) => f.name === exp.name
      );
      if (existing) {
        existing.expense += exp.expense;
      } else {
        this.yearlyExpenseFinal.push(exp);
      }
    }

    this.yearlyExpenseTotel = 0;
    this.yearlyIncomeTotel = 0;

    this.yearlyExpenseFinal = this.yearlyExpenseFinal.sort(
      (a: any, b: any) => b.expense - a.expense
    );
    for (const val of this.yearlyExpenseFinal) {
      this.yearlyExpenseTotel += val.expense;
    }

    // allTime
    this.allTimeExpense = [];
    const allTimeExpenseCopy = JSON.parse(JSON.stringify(this.expenses));
    for (let val of allTimeExpenseCopy) {
      const existingItem = this.allTimeExpense.find(
        (f: any) => f.name === val.name
      );
      if (existingItem) {
        existingItem.expense += val.expense;
      } else {
        this.allTimeExpense.push(val);
      }
    }
    this.allTimeExpense = this.allTimeExpense.sort(
      (a: any, b: any) => b.expense - a.expense
    );
    for (let v of this.allTimeExpense) {
      this.allTimeExpenseTotal += v.expense;
    }
  }

  getIncomes() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getIncomes().subscribe((data: any) => {
      this.incomes = data.filter((f: any) => {
        return f.userId == id;
      });
      const monthIncomeCopy = [...this.incomes];
      this.incomesJulay = monthIncomeCopy.filter(
        (data: any) =>
          Number(data.day.substring(5, 7)) == parseInt(this.idOfMonth) &&
          data.day.substring(0, 4) === this.selectedYear
      );
      const yearlyIncomeCopy = [...this.incomes];
      this.yearlyIncome = yearlyIncomeCopy.filter(
        (f: any) => f.day.substring(0, 4) === this.selectedYear
      );
      for (let val of this.incomes) {
        this.allTimeIncome += val.amount;
      }
      for (const val of this.incomesJulay) {
        this.totalIncomeJulay += val.amount;
      }
      // year

      for (let val of this.yearlyIncome) {
        this.yearlyIncomeTotel += val.amount;
      }

      this.balenceJulay = this.totalIncomeJulay - this.totalExpJulay;
      this.yearlyBalence = this.yearlyIncomeTotel - this.yearlyExpenseTotel;
      this.allTimeExpenseBalance =
        this.allTimeIncome - this.allTimeExpenseTotal;
    });
  }
  chartOptions: any;
  chartOption: any;
  chartOptions2: any;
  chartOption2: any;
  chartOptions3: any;
  chartOption3: any;
  getExpensePercentage() {
    for (let exp of this.finalExpenseJulay) {
      exp.y = (exp.expense * 100) / this.totalExpJulay;
    }
    this.chartOptions = {
      animationEnabled: true,
      data: [
        {
          type: 'pie',
          startAngle: 45,
          indexLabel: '{name}: {y}',
          indexLabelPlacement: 'inside',
          yValueFormatString: "#,###.##'%'",
          dataPoints: this.finalExpenseJulay,
        },
      ],
    };
    this.chartOption = {
      title: {
        text: 'Total Impressions by Platforms',
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        suffix: '%',
      },
      data: [
        {
          type: 'bar',
          indexLabel: '{name}: {y}',
          yValueFormatString: "#,###.##'%'",
          dataPoints: this.finalExpenseJulay,
        },
      ],
    };
    // for year
    for (let exp of this.yearlyExpenseFinal) {
      exp.y = (exp.expense * 100) / this.yearlyExpenseTotel;
    }
    this.chartOptions2 = {
      animationEnabled: true,
      data: [
        {
          type: 'pie',
          startAngle: 45,
          indexLabel: '{name}: {y}',
          indexLabelPlacement: 'inside',
          yValueFormatString: "#,###.##'%'",
          dataPoints: this.yearlyExpenseFinal,
        },
      ],
    };
    this.chartOption2 = {
      title: {
        text: 'Total Impressions by Platforms',
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        suffix: '%',
      },
      data: [
        {
          type: 'bar',
          indexLabel: '{name}: {y}',
          yValueFormatString: "#,###.##'%'",
          dataPoints: this.yearlyExpenseFinal,
        },
      ],
    };
    // Alltime
    for (let exp of this.allTimeExpense) {
      exp.y = (exp.expense * 100) / this.allTimeExpenseTotal;
    }
    this.chartOptions3 = {
      animationEnabled: true,
      data: [
        {
          type: 'pie',
          startAngle: 45,
          indexLabel: '{name}: {y}',
          indexLabelPlacement: 'inside',
          yValueFormatString: "#,###.##'%'",
          dataPoints: this.allTimeExpense,
        },
      ],
    };
    this.chartOption3 = {
      title: {
        text: 'Total Impressions by Platforms',
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        suffix: '%',
      },
      data: [
        {
          type: 'bar',
          indexLabel: '{name}: {y}',
          yValueFormatString: "#,###.##'%'",
          dataPoints: this.allTimeExpense,
        },
      ],
    };
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
        PDF.save(`FCB REPORT ${this.monthSelected} ${this.selection}`);
      }
    );
  }
}
