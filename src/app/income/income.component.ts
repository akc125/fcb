import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
})
export class IncomeComponent {
  incomeFormGroup = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
  });
  defaultDate: any;
  ngOnInit(): void {
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
    this.getIncomes();
  }
  constructor(
    private categoriesServiesFire: CategoryFireService,
    private router: Router
  ) {}
  incomes: any = ([] = []);
  incomTotal: number = 0;
  getIncomes() {
    const id = localStorage.getItem('userId');
    this.categoriesServiesFire.getIncomes().subscribe((data: any) => {
      this.incomes = data
        .filter((f: any) => f.userId == id)
        .sort(
          (a: any, b: any) =>
            new Date(b.day).getTime() - new Date(a.day).getTime()
        );
      let am = 0;
      for (let val of this.incomes) {
        am += Number(val.amount);
        this.incomTotal = am;
      }
    });
  }

  addIncome() {
    const formData = this.incomeFormGroup.value;
    this.categoriesServiesFire.addIncomes(formData).then((data) => {
      this.incomeFormGroup.setValue({ amount: '', date: this.defaultDate });
      this.getIncomes();
    });
  }
  deleteIncome(id: any) {
    console.log('incmid', id, this.incomes);
    const confirm = window.confirm('are you sure you want to delete income');

    if (confirm) {
      this.categoriesServiesFire.deleteIncomes(id).then((data) => {
        this.getIncomes();
      });
    }
  }
}
