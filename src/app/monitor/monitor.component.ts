import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent {
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
  balenceJulay: number = 0;

  yearlyExpense: any = [];
  yearlyExpenseFinal: any = [];
  yearlyExpenseTotel: any = [];
  yearlyIncome: any = [];
  yearlyIncomeTotel: number = 0;
  yearlyBalence: number = 0;

  monthsList = [
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
  monthId: any;
  selectedMonth(event: any) {
    this.monthSelected = event.target.value;
    const selected = this.monthsList.find(
      (f: any) => f.name === this.monthSelected
    );
    this.monthId = selected?.id;
    this.getExpense();
  }
  selectedYear: any = '';
  idOfMonth: any = '';
  passId() {
    this.selectedYear = this.selection;
    this.idOfMonth = this.monthId;
  }
  userId = localStorage.getItem('userId');
  getExpense() {
    const id=localStorage.getItem('userId');
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
      for (const val of this.yearlyExpense) {
        this.yearlyExpenseTotel += val.expense;
      }
      console.log('july', this.expenses);
      this.totalExpJulay = 0;
      this.totalIncomeJulay = 0;
      this.finalExpenseJulay.sort((a: any, b: any) => b.expense - a.expense);
      for (const val of this.finalExpenseJulay) {
        this.totalExpJulay += val.expense;
      }
    });
  }

  getIncomes() {
    const id=localStorage.getItem('userId');
    this.categoriesService.getIncomes().subscribe((data:any) => {
      this.incomes = data.filter((f:any)=>{
        return f.userId==id
      })
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
        'incom',this.incomes,
        this.yearlyIncomeTotel,
        this.yearlyExpenseTotel,
        this.yearlyBalence
      );
    });
  }
}
