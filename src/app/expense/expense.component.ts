import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent {
  constructor(
    private route: ActivatedRoute,
    private categoriesServices: CategoriesService,
    private router: Router
  ) {}
  defaultDate: any;
  ngOnInit(): void {
    this.getCategory();
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
    this.getExpenses();
  }
  expense: any;
  exName: any = '';
  id: any = this.route.snapshot.paramMap.get('id');
  expenseFormGroup = new FormGroup({
    expense: new FormControl(this.exName),
    name: new FormControl(),
    date: new FormControl(),
    catId: new FormControl(this.id),
  });
  categories: any = [];
  async getCategory() {
    this.categoriesServices.getCategories().subscribe((data: any) => {
      this.categories = data;
      this.findName();
    });
  }
  date = new Date();
  findName() {
    this.expense = this.categories.find((f: any) => f.id == this.id);
    this.exName = this.expense.name;
  }

  addData() {
    const formData = {
      ...this.expenseFormGroup.value,
      name: this.expense.name,
    };
    console.log('valll', formData);
    this.categoriesServices.addExpense(formData).subscribe((data: any) => {
      this.getExpenses()
    });
  }
  expenses: any = [];
  expenseTotel: number = 0;
  getExpenses() {
    const id=localStorage.getItem("userId")
    this.categoriesServices.getExpensList().subscribe((data) => {
      this.expenses = data;
      this.expenses = this.expenses.filter((f: any) => f.catId == this.id && f.userId==id);
      for (const exp of this.expenses) {
        this.expenseTotel += exp.expense;
      }
    });
  }
  navigateToDetailsPage(id:any) {
    this.router.navigate([`categories/:id/expenseDetails/${id}`]);
  }
}
