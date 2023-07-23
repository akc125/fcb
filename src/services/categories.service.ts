import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  userId = localStorage.getItem('userId');
  constructor(private http: HttpClient) {}
  endpoint = 'http://localhost:5000/categories';
  getCategories() {
    return this.http.get(this.endpoint, {});
  }
  addCategoris(data: any) {
    const id=localStorage.getItem('userId');
    console.log("addct",this.userId,data)
    return this.http.post(this.endpoint, {
      name: data,
      userId: id,
    });
  }
  addExpense(data: any) {
    const id=localStorage.getItem('userId');
    return this.http.post('http://localhost:5000/expense', {
      name: data.name,
      expense: data.expense,
      catId: data.catId,
      day: data.date,
      userId: id,
    });
  }
  getExpensList() {
    return this.http.get('http://localhost:5000/expenses', {});
  }
  addIncomes(data: any) {
    const id=localStorage.getItem('userId');
    return this.http.post('http://localhost:5000/incomes', {
      amount: data.amount,
      day: data.date,
      userId: id,
    });
  }
  getIncomes() {
    return this.http.get('http://localhost:5000/incomes', {});
  }

  getDescription() {
    return this.http.get('http://localhost:5000/descriptions', {});
  }
  postDesciption(data: any) {
    const id=localStorage.getItem('userId');
    return this.http.post('http://localhost:5000/descriptions', {
      desc: data.desc,
      date: data.date,
      descId: data.descId,
      userId: id,
    });
  }
  getLogin(data: any) {
    return this.http.post('http://localhost:5000/login', {
      name: data.name,
      password: data.password,
    });
  }
  registerUser(data: any) {
    return this.http.post('http://localhost:5000/register', {
      name: data.name,
      password: data.password,
    });
  }
}
