import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
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
  getBudgets() {
    return this.firestore
      .collection('budget')
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
  postBudget(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore.collection('budget').add({
      ...data,
      userId: userId,
    });
  }

  EditBudget(data: any) {
    const userId = localStorage.getItem('userId');
    return this.firestore
      .collection('budget')
      .doc(data.id)
      .update({
        ...data,
        userId: userId,
      });
  }

  deleteBudget(documentId: string) {
    return this.firestore.collection('budget').doc(documentId).delete();
  }

  // addCategory(data: any) {
  //   const userId = localStorage.getItem('userId');
  //   return this.firestore.collection('categories').add({
  //     name: data,
  //     userId: userId,
  //   });
  // }
  // updateNotificationCategory(data: any) {
  //   console.log('updationdata', data);
  //   return this.firestore
  //     .collection('notification-categories')
  //     .doc(data.id)
  //     .update(data);
  // }
}
