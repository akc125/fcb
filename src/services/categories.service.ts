import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}
  endpoint = 'http://localhost:5000/categories';
  getCategories() {
    return this.http.get(this.endpoint, {});
  }
  addCategoris(data: any) {
    return this.http.post(this.endpoint, {
      name: data,
    });
  }
  addExpense(data: any) {
    return this.http.post('http://localhost:5000/expense', {
      name: data.name,
      expense: data.expense,
      catId: data.catId,
      day: data.date,
    });
  }
  getExpensList() {
    return this.http.get('http://localhost:5000/expenses', {});
  }
  addIncomes(data: any) {
    return this.http.post('http://localhost:5000/incomes', {
      amount: data.amount,
      day: data.date,
    });
  }
  getIncomes() {
    return this.http.get('http://localhost:5000/incomes', {});
  }
}
