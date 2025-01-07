import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryFireService {
  constructor(private firestore: AngularFirestore) {}

  getCategories() {
    return this.firestore
      .collection('categories')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getCredits() {
    return this.firestore
      .collection('credits')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getSingleCredit(id: string) {
    return this.firestore
      .collection('credits')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          const data = snapshot.payload.data() as any;
          const id = snapshot.payload.id;
          return { id, ...data };
        })
      );
  }
  getDebit() {
    return this.firestore
      .collection('debits')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getCreditAccounts() {
    return this.firestore
      .collection('credit-accounts')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getSingleDebit(debitId: string) {
    return this.firestore
      .collection('debits')
      .doc(debitId)
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          const data = snapshot.payload.data() as any;
          const id = snapshot.payload.id;
          return { id, ...data };
        })
      );
  }

  getTransactions() {
    return this.firestore
      .collection('transactions')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getNotificationCategory() {
    return this.firestore
      .collection('notification-categories')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getDebitAmount() {
    return this.firestore
      .collection('debit-transaction')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getDescription() {
    return this.firestore
      .collection('description')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getExpensList() {
    return this.firestore
      .collection('expense')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getAsset() {
    return this.firestore
      .collection('asset')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getTimes() {
    return this.firestore
      .collection('times')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getNotificationAndAction() {
    return this.firestore
      .collection('actions')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getDiary() {
    return this.firestore
      .collection('diary')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }
  getCommissions() {
    return this.firestore
      .collection('commision')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getCategoryById(id: string): Observable<any> {
    return this.firestore.collection('categories').doc(id).valueChanges();
  }
  getCommissionsById(id: string | undefined): Observable<any> {
    return this.firestore.collection('commision').doc(id).valueChanges();
  }
  getNotificationCategoryById(id: string): Observable<any> {
    return this.firestore
      .collection('notification-categories')
      .doc(id)
      .valueChanges();
  }

  addCategory(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore.collection('categories').add({
      name: data,
      userId: userId,
    });
  }
  addDiary(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore.collection('diary').add({
      ...data,
      userId: userId,
    });
  }
  addNotificationnotificationExpenseAndAction(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore.collection('actions').add(data);
  }

  addCredits(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore
      .collection('credits')
      .add({ ...data, userId: userId });
  }
  addCreditAccounts(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore
      .collection('credit-accounts')
      .add({ ...data, userId: userId });
  }
  editCredits(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore
      .collection('credits')
      .doc(data.id)
      .update({ ...data, userId: userId });
  }
  addCommission(data: any) {
    return this.firestore.collection('commision').add(data);
  }
  addDebit(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore.collection('debits').add({ ...data, userId: userId });
  }
  editDebits(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore
      .collection('debits')
      .doc(data.id)
      .update({ ...data, userId: userId });
  }
  deleteDebit(id: any) {
    return this.firestore.collection('debits').doc(id).delete();
  }
  deleteCredit(id: any) {
    return this.firestore.collection('credits').doc(id).delete();
  }
  addDebitAmount(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore
      .collection('debit-transaction')
      .add({ ...data, userId: userId });
  }
  hideFile(data: any) {
    return this.firestore.collection('credits').doc(data.id).update({
      active: data.hide,
    });
  }
  updateDebit(data: any) {
    return this.firestore.collection('debits').doc(data.id).update({
      active: data.active,
    });
  }
  updateCommission(data: any) {
    return this.firestore.collection('commision').doc(data.id).update(data);
  }

  updateNotificationCategory(data: any) {
    console.log('updationdata', data);
    return this.firestore
      .collection('notification-categories')
      .doc(data.id)
      .update(data);
  }

  addTransaction(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore
      .collection('transactions')
      .add({ ...data, userId: userId });
  }

  addNotificationTime(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore.collection('times').add({
      userId: userId,
      times: data,
    });
  }

  addExpense(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore.collection('expense').add({
      name: data.name,
      description: data.description,
      expense: data.expense,
      catId: data.catId,
      day: data.date,
      userId: userId,
      times: data.times,
    });
  }
  deleteExpense(expenseId: string) {
    return this.firestore.collection('expense').doc(expenseId).delete();
  }

  addIncomes(data: any) {
    const id = localStorage.getItem('userId');
    return this.firestore.collection('incomes').add({
      amount: data.amount,
      day: data.date,
      userId: id,
    });
  }
  postDesciption(data: any) {
    const id = localStorage.getItem('userId');
    return this.firestore.collection('description').add({
      desc: data.desc,
      date: data.date,
      descId: data.descId,
      userId: id,
    });
  }
  addNotificationCategory(data: any) {
    const id = localStorage.getItem('userId');
    return this.firestore
      .collection('notification-categories')
      .add({ ...data, userId: id });
  }

  getIncomes() {
    return this.firestore.collection('incomes').valueChanges();
  }
}
