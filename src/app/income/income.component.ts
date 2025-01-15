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
      console.log('income', this.incomes);
      let am = 0;
      for (let val of this.incomes) {
        am += Number(val.amount);
        this.incomTotal = am;
      }
      this.groupIncomes();
    });
  }
  groupedData: {
    year: string;
    months: {
      month: string;
      incomes: number[];
      total?: number;
    }[];
  }[] = [];
  
  groupIncomes(): void {
    const groupedByYear: Record<
      string,
      {
        year: string;
        months: {
          month: string;
          incomes: number[];
          total?: number;
        }[];
      }
    > = {};
  
    this.incomes.forEach((income: any) => {
      const [year, month] = income.day.split('-');
      const monthName = new Date(
        parseInt(year),
        parseInt(month) - 1
      ).toLocaleString('default', { month: 'short' });
  
      if (!groupedByYear[year]) {
        groupedByYear[year] = { year, months: [] };
      }
  
      const monthData = groupedByYear[year].months.find(
        (m) => m.month === monthName
      );
  
      if (!monthData) {
        groupedByYear[year].months.push({
          month: monthName,
          incomes: [income.amount],
        });
      } else {
        monthData.incomes.push(income.amount);
      }
    });
  
    this.groupedData = Object.values(groupedByYear).map((group) => ({
      ...group,
      months: group.months.map((month) => ({
        ...month,
        total:
          month.incomes.length > 1
            ? month.incomes.reduce((sum, val) => sum + val, 0)
            : undefined,
      })),
    }));
  
    // Sort to bring the current year to the top
    this.groupedData.sort((a, b) => {
      const currentYear = new Date().getFullYear().toString();
    
      if (a.year === currentYear) return -1; // Current year comes first
      if (b.year === currentYear) return 1; // Current year comes first
      return parseInt(b.year) - parseInt(a.year); // Descending order for other years
    });
    console.log('groupedData', this.groupedData);
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
