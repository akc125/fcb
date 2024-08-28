import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CategoryFireService } from 'src/services/category-fire.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
interface CreditFormData {
  name: string;
  amount: number;
  date: string;
  duration: number;
  address: string;
  status: string;
  contact: string;
}
@Component({
  selector: 'app-creadit',
  templateUrl: './creadit.component.html',
  styleUrls: ['./creadit.component.css'],
})
export class CreaditComponent {
  ngOnInit(): void {
    this.getCredit();
    this.getTransaction();
  }
  constructor(private categoriesServiceFire: CategoryFireService) {}
  creditForm = new FormGroup({
    name: new FormControl(),
    amount: new FormControl(),
    date: new FormControl(),
    duration: new FormControl(),
    address: new FormControl(),
    status: new FormControl(),
    contact: new FormControl(),
  });
  file: any; // Initialize the 'file' variable as a string or null.
  sendFile: any;
  image: any;
  setimageURL: any;
  onSelect = (e: any) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      this.image = file;

      const reader = new FileReader();
      reader.onloadend = () => {
        this.setimageURL = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  open: any;
  openForm() {
    this.open = true;
  }
  closeForm() {
    this.open = false;
  }
  async saveCredit() {
    const storage = getStorage();

    try {
      if (this.image) {
        const imageRef = ref(storage, `images/${this.image.name}`);
        const snapshot = await uploadBytes(imageRef, this.image);
        this.setimageURL = await getDownloadURL(snapshot.ref);
      }
      const newData = {
        ...this.creditForm.value,
        imageUrl: this.setimageURL,
        active: true,
      };
      await this.categoriesServiceFire.addCredits(newData);
      this.getCredit();
    } catch (error) {
      console.error('Error saving credit:', error);
      alert('An error occurred while saving the credit. Please try again.');
    }
  }

  credits: any = [];
  credits2: any = [];
  credits3: any = [];
  personsTogiveMony: any;
  toatalCreditReturned: number = 0;
  getCredit() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getCredits().subscribe((data: any) => {
      this.credits = data.filter((f: any) => f.userId == id);
      console.log('credits', data);
      this.credits.reverse();
      this.credits2 = data.filter(
        (f: any) => f.active !== 'true' && f.userId == id
      );
      this.credits3 = data.filter(
        (f: any) => f.active == 'true' && f.userId == id
      );
      console.log('credits2', this.credits3);
      this.getTotal();
      this.getTransaction()
    });
    this.getTotal();
  }

  getTotal() {
    for (let val of this.credits3) {
      this.toatalCreditReturned += val.amount;
    }
  }
  trnsactionForm = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
  });
  addTransaction(creditId: any) {
    const data = { ...this.trnsactionForm.value, creditId: creditId };
    this.categoriesServiceFire.addTransaction(data).then((data: any) => {
      this.getTransaction();
    });
  }
  tansactions: any = [];
  transactionPopup = false;
  formId: any;
  openTransactionForm(id: any) {
    this.transactionPopup = true;
    this.formId = id;
  }
  closeTransactionForm() {
    this.transactionPopup = false;
  }
  totalCredit: any;
  retunedTotal: any;
  totalExsisting: any;
  currentIncome: any;
  expense: any;
  incomeWithCredit: any;
  balance: any;
  getTransaction() {
    const id = localStorage.getItem('userId');
    const incomes = localStorage.getItem('income');
    const expense = localStorage.getItem('expense');
    this.currentIncome = incomes;
    this.expense = expense;
    this.categoriesServiceFire.getTransactions().subscribe((data: any) => {
      this.tansactions = data.filter((f: any) => f.userId == id);

      for (let val of this.credits) {
        const transactions = this.tansactions.filter(
          (f: any) => f.creditId == val.id
        );
        if (transactions) {
          val.transaction = transactions.map((p: any, index: number) => ({
            ...p,
            index,
          }));
          val.total = transactions.reduce((sum: number, v: any) => {
            return sum + Number(v.amount);
          }, 0);

          val.existing = val.amount - val.total;
          if (val.existing < 0) {
            const overPaid = Math.abs(val.existing);
            val.overPaid = overPaid;
          }
          // if (val.amount - val.total == 0) {
          //   this.deActiveFile(val.id);
          // }
          val.income = Number(incomes) + Number(val.total || val.amount);
          if (val.existing < 0) {
            val.income =
              Number(incomes) +
              Number(val.total || val.amount) +
              Number(val.overPaid);
          }
          val.currentIncome = incomes;
          val.expense = expense;
          val.balance = Number(val.income) - Number(expense);
          val.crrentBalance = Number(incomes) - Number(expense);
          const lastTransaction = transactions[transactions.length - 1];
          val.finishedDate = lastTransaction;
        }
      }
      this.personsTogiveMony = this.credits2.length;
      let sum = 0;
      let returnedAmount = 0;
      for (let v of this.credits2) {
        sum = sum + Number(v.amount);
        for (let b of v.transaction) {
          returnedAmount += Number(b.amount);
        }
      }
      this.totalCredit = sum;
      this.retunedTotal = returnedAmount;
      this.totalExsisting = this.totalCredit - this.retunedTotal;
      this.incomeWithCredit = parseFloat(this.currentIncome) + Number(sum);
      this.balance = this.incomeWithCredit - this.expense;
    });
  }
  hide: boolean = false;
  deActiveFile(id: any) {
    this.hide = false;
    const data = { id: id, hide: this.hide };
    this.categoriesServiceFire.hideFile(data).then((data: any) => {
      this.getCredit();
      this.getTransaction();
    });
  }
  activeFile(id: any) {
    this.hide = true;
    const data = { id: id, hide: this.hide };
    this.categoriesServiceFire.hideFile(data).then((data: any) => {
      this.getCredit();
      this.getTransaction();
    });
  }
  openRecord: any = false;
  openDeactiveFile() {
    this.openRecord = true;
  }
  closeDeactiveFile() {
    this.openRecord = false;
  }
}
