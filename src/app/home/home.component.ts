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
  finalExpense: any = [];
  expense: any = [];
  thisMonthExpense: any = [];
  expensTotel: number = 0;
  income: any = [];
  incomeTotel: number = 0;
  balense: number = 0;
  getExpenses() {
    this.categoriesService.getExpensList().subscribe((data) => {
      this.expense = data;
      this.calculateExpense();
    });
  }
  calculateExpense() {
    this.thisMonthExpense = this.expense.filter(
      (f: any) => f.day.substring(5, 7) === this.defaultDate
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
  }
  getIncome() {
    this.categoriesService.getIncomes().subscribe((data) => {
      this.income = data;
      this.income = this.income.filter(
        (f: any) => f.day.substring(5, 7) === this.defaultDate
      );
      for (const inc of this.income) {
        this.incomeTotel += inc.amount;
      }
      this.balense = this.incomeTotel - this.expensTotel;
    });
  }
}
