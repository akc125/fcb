import { CategoriesService } from 'src/services/categories.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-comprehensive-finance-hub',
  templateUrl: './comprehensive-finance-hub.component.html',
  styleUrls: ['./comprehensive-finance-hub.component.css'],
})
export class ComprehensiveFinanceHubComponent {
  @ViewChild('invoice') invoiceElement!: ElementRef;
  defualtDate: any;
  currentYear: any = '2024';
  currentMonth: any;

  ngOnInit(): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.defualtDate = currentDate.toISOString().substring(5, 7);
    this.currentMonth = new Intl.DateTimeFormat('en-US', {
      month: 'long',
    }).format(currentDate);
    this.getCategories();
    this.getIncomes();
    setTimeout(() => {
      this.getExpensePercentage();
    }, 2000);
  }
  constructor(
    private categoriesServiceFire: CategoryFireService
  ) {}
  selection: any;
  onSelected(event: any) {
    this.selection = event.target.value;
    this.getExpense();
    this.getIncomes();
  }
  allTimeExpense: any = [];
  allTimeExpenseTotal: number = 0;
  allTimeExpenseBalance: number = 0;
  allTimeIncome: number = 0;
  expenses: any = [];
  incomes: any = [];
 
 
  monthSelected: any;
  monthId: any = 1;
  sum: number = 0;

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
      for (let val of this.incomes) {
        this.allTimeIncome += val.amount;
      }
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
