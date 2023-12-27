import { CategoriesService } from "src/services/categories.service";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-expense",
  templateUrl: "./expense.component.html",
  styleUrls: ["./expense.component.css"],
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
    this.defualtMonth = currentDate.toISOString().substring(5, 7);
    this.getExpenses();
  }
  firstDate: any;
  lastDate: any;
  filter: boolean = false;
  expense: any;
  exName: any = "";
  defualtMonth: any;
  id: any = this.route.snapshot.paramMap.get("id");
  expenseFormGroup = new FormGroup({
    expense: new FormControl(this.exName),
    name: new FormControl(),
    date: new FormControl(),
    catId: new FormControl(this.id),
    times:new FormControl(new Date())
  });
  dateFilterGroup = new FormGroup({
    lastDate: new FormControl(),
    firstDate: new FormControl(),
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
    this.categoriesServices.addExpense(formData).subscribe((data: any) => {
      this.getExpenses();
    });
  }
  expenses: any = [];
  compleateExpense: any = [];
  compleateCategoryExpense: any = [];
  expenseTotel: number = 0;
  filteredData: any[] = [];
  mapedData: any[] = [];
  filteredTotal: number = 0;
  async getExpenses() {
    const id = localStorage.getItem("userId");
    this.categoriesServices.getExpensList().subscribe((data) => {
      this.expenses = data;
      this.compleateExpense = data;
      this.expenses = this.expenses.filter(
        (f: any) =>
          f.catId == this.id &&
          f.userId == id &&
          f.day.substring(5, 7) === this.defualtMonth
      );
      for (const exp of this.expenses) {
        this.expenseTotel += exp.expense;
      }
      this.getMapping();
    });
  }

  getFiltered() {
    const id = localStorage.getItem("userId");
    this.compleateCategoryExpense = this.compleateExpense.filter(
      (f: any) => f.catId == this.id && f.userId == id
    );
    setTimeout(() => {
      for (const exp of this.compleateCategoryExpense) {
        this.filteredTotal += exp.expense;
      } 
    }, 100);
   
    const lastDate = this.dateFilterGroup.get("lastDate")?.value;
    const firstDate = this.dateFilterGroup.get("firstDate")?.value;
    this.filteredData = this.compleateCategoryExpense.filter(
      (f: any) => f.day > lastDate && f.day < firstDate
    );
    this.filter = true;
  }
  changValue() {
    this.filter = false;
  }
  getMapping() {
    let total = 0;
    for (let num of this.mapedData) {
      total += num.expense;
      this.filteredTotal = total;
    }
    if (this.filter == true) {
      this.mapedData = this.filteredData;
    } else {
      this.mapedData = this.expenses;
    }
    this.mapedData.reverse()
  }

  navigateToDetailsPage(id: any) {
    this.router.navigate([`categories/:id/expenseDetails/${id}`]);
  }
}
