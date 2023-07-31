import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  defaultDate: any;
  month: any;
  year: any;
  ngOnInit(): void {
    this.getExpenses();
    this.getIncome();
    const currentDate = new Date();
    this.month = currentDate.toLocaleString('en-US', { month: 'long' });
    this.year = currentDate.getFullYear();
    this.defaultDate = currentDate.toISOString().substring(5, 7);
  }
  constructor(private categoriesService: CategoriesService) {}
  userId = localStorage.getItem('userId');
  finalExpense: any = [];
  expense: any = [];
  thisMonthExpense: any = [];
  thisMonthIncome: any = [];
  expensTotel: number = 0;
  income: any = [];
  incomeTotel: number = 0;
  balense: number = 0;
  average: number = 0;
  getExpenses() {
    const id = localStorage.getItem('userId');
    this.categoriesService.getExpensList().subscribe((data) => {
      this.expense = JSON.parse(JSON.stringify(data)).filter((f: any) => {
        return f.userId == id;
      });

      this.calculateExpense();
    });
  }
  allExpense: any = [];
  allIncome: any = [];
  allExpenseTotel: number = 0;
  allIncomeTotel: number = 0;
  allBalence: number = 0;
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
  }
  getIncome() {
    const id = localStorage.getItem('userId');
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
  calculatePercentage(expense:number){
    return Math.round(expense*100/this.expensTotel)
  }
  calculatePercentagewithIncome(expense:number){
    return Math.round(expense*100/this.incomeTotel)
  }
}
