import { CategoriesService } from "src/services/categories.service";
import { Component, ElementRef, ViewChild } from "@angular/core";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: "app-monitor",
  templateUrl: "./monitor.component.html",
  styleUrls: ["./monitor.component.css"],
})
export class MonitorComponent {
  @ViewChild("invoice") invoiceElement!: ElementRef;
  defualtDate: any;
  currentYear: any;
  ngOnInit(): void {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    this.defualtDate = currentDate.toISOString().substring(5, 7);

  }
  constructor(private categoriesService: CategoriesService) {}
  selection: any;
  onSelected(event: any) {
    this.selection = event.target.value;
  }

  expenses: any = [];
  expensesJulay: any = [];
  incomes: any = [];
  incomesJulay: any = [];
  totalIncomeJulay: number = 0;
  finalExpenseJulay: any = [];
  totalExpJulay: number = 0;
  balenceJulay: number = 10;

  yearlyExpense: any = [];
  yearlyExpenseFinal: any = [];
  yearlyExpenseTotel: any = [];
  yearlyIncome: any = [];
  yearlyIncomeTotel: number = 0;
  yearlyBalence: number = 0;

  monthsList = [
    { id: "01", name: "January" },
    { id: "02", name: "February" },
    { id: "03", name: "March" },
    { id: "04", name: "April" },
    { id: "05", name: "May" },
    { id: "06", name: "June" },
    { id: "07", name: "July" },
    { id: "08", name: "August" },
    { id: "09", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" },
  ];

  monthSelected: any;
  monthId: any;
  selectedMonth(event: any) {
    this.monthSelected = event.target.value;
    const selected = this.monthsList.find(
      (f: any) => f.name === this.monthSelected
    );
    this.monthId = selected?.id;
    this.getExpense();
  }
  selectedYear: any = 2023;
  idOfMonth: any = '09';
  passId() {
    this.selectedYear = this.selection;
    this.idOfMonth = this.monthId;
    console.log(' this.selectedYear', this.selectedYear,this.idOfMonth,this.finalExpenseJulay)
  }
  userId = localStorage.getItem("userId");
  getExpense() {
    const id = localStorage.getItem("userId");
    this.categoriesService.getExpensList().subscribe((data: any) => {
      const expensesCopy = [...this.expenses];
      this.expenses = data.filter((f: any) => f.userId == id);

      this.expensesJulay = expensesCopy.filter(
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
          existing.expense += exp.expense;
        } else {
          this.finalExpenseJulay.push(exp);
        }
      }

      // year
      this.yearlyExpenseFinal = [];
      const yearlyExpenseCopy = [...this.expenses];
      this.yearlyExpense = yearlyExpenseCopy.filter(
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
      console.log("july", this.yearlyExpenseFinal);
      this.totalExpJulay = 0;
      this.totalIncomeJulay = 0;
      this.finalExpenseJulay.sort((a: any, b: any) => b.expense - a.expense);
      for (const val of this.finalExpenseJulay) {
        this.totalExpJulay += val.expense;
      }
    });
    setTimeout(() => {
      this.getExpensePercentage();
    }, 1000);
  }

  getIncomes() {
    const id = localStorage.getItem("userId");
    this.categoriesService.getIncomes().subscribe((data: any) => {
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

      for (const val of this.incomesJulay) {
        this.totalIncomeJulay += val.amount;
      }
      // year

      for (let val of this.yearlyIncome) {
        this.yearlyIncomeTotel += val.amount;
      }

      this.balenceJulay = this.totalIncomeJulay - this.totalExpJulay;
      this.yearlyBalence = this.yearlyIncomeTotel - this.yearlyExpenseTotel;
      console.log(
        "incom",
        this.incomes,
        this.yearlyIncomeTotel,
        this.yearlyExpenseTotel,
        this.yearlyBalence
      );
    });
  }
  chartOptions: any;
  chartOption: any;
  chartOptions2: any;
  chartOption2: any;
  getExpensePercentage() {
    for (let exp of this.finalExpenseJulay) {
      exp.y = (exp.expense * 100) / this.totalExpJulay;
    }
    this.chartOptions = {
      animationEnabled: true,
      data: [
        {
          type: "pie",
          startAngle: 45,
          indexLabel: "{name}: {y}",
          indexLabelPlacement: "inside",
          yValueFormatString: "#,###.##'%'",
          dataPoints: this.finalExpenseJulay
        },
      ],
    };
   this. chartOption = {
      title: {
        text: "Total Impressions by Platforms"
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        suffix: "%"
      },
      data: [{
        type: "bar",
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###.##'%'",
        dataPoints: this.finalExpenseJulay
      }]
    }
// for year
    for (let exp of this.yearlyExpenseFinal) {
      exp.y = (exp.expense * 100) / this.yearlyExpenseTotel;
    }
    this.chartOptions2 = {
      animationEnabled: true,
      data: [
        {
          type: "pie",
          startAngle: 45,
          indexLabel: "{name}: {y}",
          indexLabelPlacement: "inside",
          yValueFormatString: "#,###.##'%'",
          dataPoints: this.yearlyExpenseFinal
        },
      ],
    };
   this. chartOption2 = {
      title: {
        text: "Total Impressions by Platforms"
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        suffix: "%"
      },
      data: [{
        type: "bar",
        indexLabel: "{name}: {y}",
        yValueFormatString: "#,###.##'%'",
        dataPoints: this.yearlyExpenseFinal
      }]
    }
  }

  public generatePDF(): void {
    html2canvas(this.invoiceElement.nativeElement, { scale: 1.5 }).then(
      (canvas) => {
        const imageGeneratedFromTemplate = canvas.toDataURL("image/png");
        const fileWidth = 200;
        const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
        let PDF = new jsPDF("p", "mm", "a4");
        PDF.addImage(
          imageGeneratedFromTemplate,
          "PNG",
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
