import { Component } from '@angular/core';
import { flush } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from 'src/services/categories.service';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  catVal = new FormControl('');
  incomeFormGroup = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
  });

  ngOnInit(): void {
    this.getCategory();
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
    this.getIncomes();
    this.defualtMonth = currentDate.toISOString().substring(5, 7);
    this.defualtYear = currentDate.toISOString().substring(0, 4);
    this.defualtMonthName = new Date(
      0,
      Number(this.defualtMonth) - 1
    ).toLocaleString('default', {
      month: 'long',
    });
    this.getExpenses();
    setTimeout(() => {
      this.compainCatWithExpense();
    }, 1000);
    this.search.valueChanges.subscribe(() => {
      this.getCategory();
    });
  }
  constructor(
    private categoriesServiesFire: CategoryFireService,
    private router: Router
  ) {}
  data: any = {};
  defaultDate: any;
  defualtMonth: any;
  defualtYear: any;
  categories: any = [];
  all: any = false;
  current: any = false;
  search: any = new FormControl();
  expenseFormGroup = new FormGroup({
    expense: new FormControl(),
    name: new FormControl(),
    description: new FormControl(),
    date: new FormControl(),
    catId: new FormControl(),
    times: new FormControl(new Date()),
  });

  catId: any;
  addCatId(id: any) {
    this.catId = id;
  }
  clear() {
    console.log('search', this.search);
    this.search.setValue(null);
  }
  swithToAll() {
    this.expenseTotel = 0;
    this.all = true;
    this.current = false;
    this.getExpenses();
    this.defualtMonthName = '';
    this.defualtYear = '';
  }
  switchToCurrent() {
    this.current = true;
    this.expenseTotel = 0;
    this.all = false;
    const currentDate = new Date();
    let defualtMonth = currentDate.toISOString().substring(5, 7);
    let defualtYear = currentDate.toISOString().substring(0, 4);
    this.defualtMonth = defualtMonth;
    this.defualtYear = defualtYear;
    let monthName = new Date(0, Number(defualtMonth) - 1).toLocaleString(
      'default',
      {
        month: 'long',
      }
    );
    this.defualtMonthName = monthName;
    this.getExpenses();
  }
  defualtMonthName: any;
  changeMonthToPreve(): void {
    if (this.current) {
      this.expenseTotel = 0;
      this.all = false;
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
    } else {
      this.switchToCurrent();
    }
  }
  addData() {
    let fmData = { ...this.expenseFormGroup.value, catId: this.catId };
    this.categoriesServiesFire.addExpense(fmData).then((data) => {
      this.getExpenses();
      this.getCategory();
      this.expenseFormGroup.setValue({
        expense: '',
        name: '',
        description: '',
        date: this.defaultDate,
        catId: '',
        times: new Date(),
      });
    });
  }
  deleteExpense(id: any) {
    // Ask for user confirmation before proceeding with the deletion
    const confirmDelete = confirm(
      'Are you sure you want to delete this expense?'
    );

    if (confirmDelete) {
      this.categoriesServiesFire
        .deleteExpense(id)
        .then(() => {
          // Refresh the expenses and categories after deletion
          this.getExpenses();
          this.getCategory();
        })
        .catch((error) => {
          console.error('Error deleting expense:', error);
        });
    } else {
      console.log('Deletion canceled');
    }
  }

  addCategory() {
    if (this.catVal.value) {
      this.categoriesServiesFire
        .addCategory(this.catVal.value)
        .then(() => {
          this.getCategory();
          this.catVal.setValue('');
        })
        .catch((error) => {
          console.error('Error adding category: ', error);
        });
    }
  }

  getCategory() {
    const id = localStorage.getItem('userId');
    this.categoriesServiesFire.getCategories().subscribe((data: any) => {
      this.categories = data.filter((f: any) => f.userId === id);
      if (this.search.value) {
        let ans = this.search.value.toLowerCase();
        this.categories = this.categories.filter((f: any) =>
          f.name.toLowerCase().includes(ans)
        );
      }

      this.sortCategory();
      this.compainCatWithExpense();
    });
  }
  sortCategory() {
    this.categories.sort((a: any, b: any) => a.name.localeCompare(b.name));
  }
  selection: any;
  onSelected(id: any) {
    this.router.navigate([`categories/${id}`]);
  }
  addIncome() {
    const formData = this.incomeFormGroup.value;
    this.categoriesServiesFire.addIncomes(formData).then((data) => {
      this.incomeFormGroup.setValue({ amount: '', date: this.defaultDate });
      this.getIncomes();
    });
  }
  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      color += letters.charAt(randomIndex);
    }
    return color;
  }
  incomes: any = ([] = []);
  getIncomes() {
    const id = localStorage.getItem('userId');
    this.categoriesServiesFire.getIncomes().subscribe((data: any) => {
      this.incomes = data.filter((f: any) => {
        return f.userId == id;
      });
    });
  }
  expenses: any = [];
  descriptions: any = [];
  expenseTotel: any = 0;
  async getExpenses() {
    const id = localStorage.getItem('userId');
    this.categoriesServiesFire.getDescription().subscribe((data) => {
      this.descriptions = data;
      this.descriptions = this.descriptions.filter((f: any) => f.userId == id);
    });

    this.categoriesServiesFire.getExpensList().subscribe((data) => {
      if (this.all) {
        this.expenses = data;
      } else {
        console.log('currentDate', this.defualtYear, this.defualtMonth);
        this.expenses = data.filter(
          (f: any) =>
            f.userId == id &&
            f.day.substring(5, 7) === this.defualtMonth &&
            f.day.substring(0, 4) === this.defualtYear.toString()
        );
      }
      let ans = 0;
      for (const exp of this.expenses) {
        ans += exp.expense||0;
      }
      this.expenseTotel = ans;
      console.log('expes', this.expenses);
      this.compainCatWithExpense();
    });
  }

  compainCatWithExpense() {
    this.categories = this.categories
      .map((p: any) => {
        let total = 0;
        const fltData = this.expenses
          .filter((f: any) => f.catId == p.id)
          .sort(
            (a: any, b: any) =>
              new Date(b.day).getTime() - new Date(a.day).getTime()
          )
          .map((p: any, index: number) => {
            total += p.expense;
            const fltDesc = this.descriptions.filter(
              (f: any) => f.descId == p.id
            );
            return {
              ...p,
              index: index + 1,
              desc: fltDesc,
            };
          });
        return {
          ...p,
          total: total,
          expense: fltData,
          expensNumber: fltData.length,
        };
      })
      .sort((a: any, b: any) => b.expensNumber - a.expensNumber);
  }
}
