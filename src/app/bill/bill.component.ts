import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css'],
})
export class BillComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  // typed fields
  thisMonthExpense: any[] = [];
  categories: any[] = [];
  userId: string | null = localStorage.getItem('userId');
  finalExpense: { name: string; expense: number }[] = [];
  topThreeExpenses: { name: string; expense: number }[] = [];
  expense: any[] = [];
  thisMonthIncome: any[] = [];
  expenseTotal = 0;
  income: any[] = [];
  incomeTotal = 0;
  balance = 0;
  average = 0;
  defaultMonthNumber = 0; // numeric month (1-12)
  month = '';
  year = 0;
  day = '';

  groupedExpenses: {
    date: string;
    items: { category: string; expense: number }[];
    total: number;
  }[] = [];

  constructor(private categoriesServiceFire: CategoryFireService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.month = currentDate.toLocaleString('en-US', { month: 'long' });
    this.year = currentDate.getFullYear();
    this.defaultMonthNumber = currentDate.getMonth() + 1; // 1..12
    this.day = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    this.getCategoriesAndExpenses();
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  getCategoriesAndExpenses() {
    const s1 = this.categoriesServiceFire.getCategories().subscribe((catData) => {
      this.categories = catData || [];

      const s2 = this.categoriesServiceFire.getExpensList().subscribe((expData) => {
        const id = localStorage.getItem('userId');
        // clone and filter by user
        this.expense = (JSON.parse(JSON.stringify(expData)) || []).filter(
          (f: any) => f.userId === id
        );
        this.calculateExpense();
      });

      this.subs.push(s2);
    });

    this.subs.push(s1);
  }

  // helper to safely parse date parts (fallbacks to substring if Date parsing fails)
  private getDateParts(day: any) {
    const s = String(day);
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return { year: d.getFullYear(), month: d.getMonth() + 1, dateObj: d };
    }
    // fallback for 'YYYY-MM-DD...' style
    const year = Number(s.substring(0, 4));
    const month = Number(s.substring(5, 7));
    const date = Number(s.substring(8, 10)) || 1;
    return { year, month, dateObj: new Date(year, month - 1, date) };
  }

  calculateExpense() {
    // 1) Normalize each expense: ensure expense is a number and attach category name.
    for (const val of this.expense) {
      val.expense = Number(val.expense) || 0; // IMPORTANT: convert to number once
      val.name =
        this.categories.find((c: any) => c.id === val.catId)?.name || 'Unknown';
    }

    // 2) Filter the current month's expenses using robust parsing
    this.thisMonthExpense = this.expense.filter((f: any) => {
      const { year, month } = this.getDateParts(f.day);
      return year === this.year && month === this.defaultMonthNumber;
    });

    // 3) Aggregate by category (map -> array). Use numeric sums only.
    const catMap = new Map<string, number>();
    for (const e of this.thisMonthExpense) {
      const name = e.name || 'Unknown';
      catMap.set(name, (catMap.get(name) || 0) + Number(e.expense || 0));
    }
    this.finalExpense = Array.from(catMap.entries()).map(([name, expense]) => ({
      name,
      expense,
    })).sort((a, b) => b.expense - a.expense);

    // 4) Top-3 categories by amount:
    this.topThreeExpenses = this.finalExpense.slice(0, 3);

    // If instead you meant "most recent 3 expense items", uncomment:
    // this.topThreeExpenses = [...this.thisMonthExpense]
    //   .sort((a,b) => new Date(b.day).getTime() - new Date(a.day).getTime())
    //   .slice(0,3)
    //   .map(e => ({ name: e.name, expense: Number(e.expense) }));

    // 5) Total expense (numeric)
    this.expenseTotal = this.finalExpense.reduce((sum, x) => sum + Number(x.expense || 0), 0);

    localStorage.setItem('expense', String(this.expenseTotal));

    // 6) Group by date (YYYY-MM-DD) and compute per-day totals
    this.groupExpensesByDate();
  }

  groupExpensesByDate() {
    const expenseMap: {
      [dateKey: string]: { items: { category: string; expense: number }[]; total: number };
    } = {};

    for (const item of this.thisMonthExpense) {
      const dateKey = (() => {
        const d = new Date(String(item.day));
        if (!isNaN(d.getTime())) return d.toISOString().substring(0, 10); // 'YYYY-MM-DD'
        return String(item.day).substring(0, 10); // fallback
      })();

      const category =
        this.categories.find((cat: any) => cat.id === item.catId)?.name || 'Unknown';
      const expenseNumber = Number(item.expense) || 0;

      if (!expenseMap[dateKey]) expenseMap[dateKey] = { items: [], total: 0 };
      expenseMap[dateKey].items.push({ category, expense: expenseNumber });
      expenseMap[dateKey].total += expenseNumber;
    }

    this.groupedExpenses = Object.entries(expenseMap)
      .map(([date, d]) => ({ date, items: d.items, total: d.total }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  getDisplayDate(dateString: string): string {
  const inputDate = new Date(dateString);
  const today = new Date();

  // normalize to YYYY-MM-DD (ignore time)
  const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const normalizedInput = normalize(inputDate);
  const normalizedToday = normalize(today);

  const diffTime = normalizedToday.getTime() - normalizedInput.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return inputDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

}
