import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent {
  constructor(
    private route: ActivatedRoute,
    private categoriesServices: CategoriesService
  ) {}
  defaultDate: any;
  ngOnInit(): void {
    this.getCategory();
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
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
    this.categoriesServices.addExpense(formData).subscribe((data: any) => {});
  }
  
}
