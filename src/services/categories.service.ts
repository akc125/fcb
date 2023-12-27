import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  userId = localStorage.getItem("userId");
  constructor(private http: HttpClient) {}
  endpoint = "http://localhost:5000/categories";
  getCategories() {
    return this.http.get(this.endpoint, {});
  }
  addCategoris(data: any) {
    const id = localStorage.getItem("userId");
    console.log("addct", this.userId, data);
    return this.http.post(this.endpoint, {
      name: data,
      userId: id,
    });
  }
  addExpense(data: any) {
    const id = localStorage.getItem("userId");
    return this.http.post("http://localhost:5000/expense", {
      name: data.name,
      expense: data.expense,
      catId: data.catId,
      day: data.date,
      userId: id,
      times: data.times,
    });
  }
  addNotificationTime(data: any) {
    console.log(data);
    const id = localStorage.getItem("userId");
    return this.http.post("http://localhost:5000/notification", {
      userId: id,
      times: data,
    });
  }
  getExpensList() {
    return this.http.get("http://localhost:5000/expenses", {});
  }
  getTimes() {
    return this.http.get("http://localhost:5000/notifications", {});
  }
  getCommissions() {
    return this.http.get("http://localhost:5000/commission", {});
  }
  getCommissionsById(id:any) {
    return this.http.get(`http://localhost:5000/commission/${id}`, {});
  }
  getCredits() {
    return this.http.get("http://localhost:5000/credit", {});
  }
  getTransactions() {
    return this.http.get("http://localhost:5000/transaction", {});
  }
  addIncomes(data: any) {
    const id = localStorage.getItem("userId");
    return this.http.post("http://localhost:5000/incomes", {
      amount: data.amount,
      day: data.date,
      userId: id,
    });
  }
  addCredits(formData: any) {
    formData.forEach((value: any, key: any) => {
      console.log(key, value);
    });
    console.log("form", formData);
    const id = localStorage.getItem("userId");

    return this.http.post("http://localhost:5000/credit", formData);
  }

  addTransaction(data: any) {
    const id = localStorage.getItem("userId");
    console.log("crvc2", data);
    return this.http.post("http://localhost:5000/transaction", {
      amount: data.amount,
      day: data.date,
      userId: id,
      creditId: data.creditId,
    });
  }
  getIncomes() {
    return this.http.get("http://localhost:5000/incomes", {});
  }

  getDescription() {
    return this.http.get("http://localhost:5000/descriptions", {});
  }
  postDesciption(data: any) {
    const id = localStorage.getItem("userId");
    return this.http.post("http://localhost:5000/descriptions", {
      desc: data.desc,
      date: data.date,
      descId: data.descId,
      userId: id,
    });
  }
  getUsers() {
    return this.http.get("http://localhost:5000/users", {});
  }
  getLogin(data: any) {
    return this.http.post("http://localhost:5000/login", {
      name: data.name,
      password: data.password,
    });
  }

  uploadfile(formData: FormData) {
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    console.log("form", formData);
    return this.http.post("http://localhost:5000/images", formData);
  }

  editUploadedFile(formData: FormData) {
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    console.log("form", formData);
    return this.http.put("http://localhost:5000/images", formData);
  }
  hideFile(data: any) {
    const id = localStorage.getItem("userId");
    console.log("form", data);
    return this.http.put("http://localhost:5000/hide", {
      id: data.id,
      active: data.hide,
    });
  }
  postForLineGraph(data: any) {
    const id = localStorage.getItem("userId");
    return this.http.post("http://localhost:5000/lineGraph", {
      amount: data.amount,
      userId: id,
      day: data.day,
    });
  }
  getFromLineGraph() {
    return this.http.get("http://localhost:5000/lineGraph", {});
  }

  // notifications

  addNotificationCategory(data: any) {
    const id = localStorage.getItem("userId");
    return this.http.post("http://localhost:5000/notificationcategory", data);
  }
  addCommission(data: any) {
    return this.http.post("http://localhost:5000/commission", data);
  }
  sendSms(data: any) {
    return this.http.post("http://localhost:5000/v1/sms", data);
  }
  sendEmail(data: any) {
    return this.http.post("http://localhost:5000/v1/send-email", data);
  }
  updateNotificationCategory(data: any,id:any) {
    return this.http.patch(`http://localhost:5000/notificationcategory/${id}`, data);
  }
  deleteNotificationCategory(id:any) {
    return this.http.delete(`http://localhost:5000/notificationcategory/${id}`);
  }
  deleteNotificationCategoryAndActions(id:any) {
    return this.http.delete(`http://localhost:5000/notificationExpenseAndAction/${id}`);
  }
  getNotificationCategory() {
    return this.http.get("http://localhost:5000/notificationcategory", {});
  }
  getNotificationAndAction() {
    return this.http.get("http://localhost:5000/notificationExpenseAndAction", {});
  }
  getNotificationCategoryById(id:any) {
    return this.http.get(`http://localhost:5000/notificationcategory/${id}`, {});
  }
  getDebit() {
    return this.http.get("http://localhost:5000/debit", {});
  }
  getDebitAmount() {
    return this.http.get("http://localhost:5000/debitAmount", {});
  }
  addNotificationnotificationExpenseAndAction(data: any) {
    const id = localStorage.getItem("userId");
    console.log("notificationExpenseAndAction", data);
    return this.http.post(
      "http://localhost:5000/notificationExpenseAndAction",data
    );
  }
  addDebit(data: any) {
    const id = localStorage.getItem("userId");
    console.log("addDebit", data);
    return this.http.post(
      "http://localhost:5000/debit",data
    );
  }
  addDebitAmount(data: any) {
    const id = localStorage.getItem("userId");
    console.log("addDebitAmount", data);
    return this.http.post(
      "http://localhost:5000/debitAmount",data
    );
  }
updateDebit(data:any,id:any){
  return this.http.put(`http://localhost:5000/debit/${id}`,data)
}
  getnotificationExpenseAndAction() {
    return this.http.get(
      "http://localhost:5000/notificationExpenseAndAction",
      {}
    );
  }
}
