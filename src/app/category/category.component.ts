import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { CategoriesService } from 'src/services/categories.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  catVal = new FormControl('');
  incomeFormGroup = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
  });
  defaultDate:any;
  ngOnInit(): void {
    this.getCategory();
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
  }
  constructor(
    private categoriesServies: CategoriesService,
    private router: Router
  ) {}
  data: any = {};
  categories: any = [];
  addCategory() {
    this.categoriesServies
      .addCategoris(this.catVal.value)
      .subscribe((data: any) => {
        this.getCategory();
        this.catVal.setValue('');
      });
  }
  getCategory() {
    this.categoriesServies.getCategories().subscribe((data: any) => {
      this.categories = data;
      console.log(data);
    });
  }
  selection:any;
  onSelected(event: any) {
    this. selection = event.target.value;

    if (this.selection) {
      this.router.navigate([`categories/${this.selection}`]);
    }
  }
  addExpense() {
    const formData=this.incomeFormGroup.value
    this.categoriesServies.addIncomes(formData).subscribe((data) => {
      this.incomeFormGroup.setValue({amount:'',date:this.defaultDate})
    });
  }
}
