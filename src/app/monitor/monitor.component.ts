import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
})
export class MonitorComponent {
  defualtDate: any;
  ngOnInit(): void {
    const currentDate = new Date();
    this.defualtDate = currentDate.toISOString().substring(5, 7);
  }
  constructor(private categoriesService: CategoriesService) {}
  selection: any;
  onSelected(event: any) {
    this.selection = event.target.value;
  }
  expenses: any = [];
  expensesJulay: any = [];
  incomes: any = [];
  incomesJulay: any = [];
  totalIncomeJulay: number = 0;
  finalExpenseJulay: any = [];
  totalExpJulay: number = 0;
  balenceJulay: number = 0;
  monthsList = [
    { id: '01', name: 'January' },
    { id: '02', name: 'February' },
    { id: '03', name: 'March' },
    { id: '04', name: 'April' },
    { id: '05', name: 'May' },
    { id: '06', name: 'June' },
    { id: '07', name: 'July' },
    { id: '08', name: 'August' },
    { id: '09', name: 'September' },
    { id: '10', name: 'October' },
    { id: '11', name: 'November' },
    { id: '12', name: 'December' },
  ];
  monthSelected: any;
  monthId: any;
  selectedMonth(event: any) {
    this.monthSelected = event.target.value;
    const selected = this.monthsList.find(
      (f: any) => f.name === this.monthSelected
    );
    this.monthId = selected?.id;
  }
  selectedYear:any='';
  idOfMonth:any='';
  passId(){
this.selectedYear=this.selection
this.idOfMonth=this.monthId
  }
 
  getExpense() {
  
    this.categoriesService.getExpensList().subscribe((data) => {
      this.expenses = data;
      this.expensesJulay = this.expenses.filter(
        (f: any) =>
          Number(f.day.substring(5, 7)) == parseInt(this.idOfMonth) &&
          f.day.substring(0, 4) === this.selectedYear
      ); 
       
      for (const exp of this.expensesJulay) {
        const existing = this.finalExpenseJulay.find(
          (f: any) => f.name === exp.name 
        );
        if (existing) {
          existing.expense += exp.expense;
        } else {
          this.finalExpenseJulay.push(exp);
        }
      }
      this.finalExpenseJulay.sort((a: any, b: any) => b.expense - a.expense);
      for (const val of this.finalExpenseJulay) {
        this.totalExpJulay += val.expense;
      }
    });
 
  }

  getIncomes() {
    this.categoriesService.getIncomes().subscribe((data) => {
      this.incomes = data;
      this.incomesJulay = this.incomes.filter(
        (data: any) =>
          Number(data.day.substring(5, 7)) == parseInt(this.idOfMonth) &&
          data.day.substring(0, 4) === this.selectedYear
      );
      for (const val of this.incomesJulay) {
        this.totalIncomeJulay += val.amount;
      }
      this.balenceJulay = this.totalIncomeJulay - this.totalExpJulay;
    });      
  }
}
