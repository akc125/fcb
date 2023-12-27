import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { CategoriesService } from "src/services/categories.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.css"],
})
export class CategoryComponent {
  catVal = new FormControl("");
  incomeFormGroup = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
  });
  defaultDate: any;
  ngOnInit(): void {
    this.getCategory();
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
    this.getIncomes();
  }
  constructor(
    private categoriesServies: CategoriesService,
    private router: Router
  ) {}
  data: any = {};
  categories: any = [];
  addCategory() {
    if (this.catVal.value) {
      this.categoriesServies
        .addCategoris(this.catVal.value)
        .subscribe((data: any) => {
          this.getCategory();
          this.catVal.setValue("");
        });
    }
  }
  getCategory() {
    const id = localStorage.getItem("userId");
    this.categoriesServies.getCategories().subscribe((data: any) => {
      this.categories = data.filter((f: any) => {
        return f.userId == id;
      });
      this.sortCategory();
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
    this.categoriesServies.addIncomes(formData).subscribe((data) => {
      this.incomeFormGroup.setValue({ amount: "", date: this.defaultDate });
      this.getIncomes();
    });
  }
  getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      color += letters.charAt(randomIndex);
    }
    return color;
  }
  incomes: any = ([] = []);
  getIncomes() {
    const id = localStorage.getItem("userId");
    this.categoriesServies.getIncomes().subscribe((data: any) => {
      this.incomes = data.filter((f: any) => {
        return f.userId == id;
      });
    });
  }
}
