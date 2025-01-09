import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CategoryFireService } from 'src/services/category-fire.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    this.getCreditAccounts();
  }
  constructor(private categoriesServiceFire: CategoryFireService) {}
  creditForm = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
    duration: new FormControl(),
    status: new FormControl(),
    creditAccount: new FormControl(),
  });
  creditAccountForm = new FormGroup({
    name: new FormControl(),
    address: new FormControl(),
    contact: new FormControl(),
  });
  file: any; // Initialize the 'file' variable as a string or null.
  sendFile: any;
  image: any;
  setimageURL: any;
  openAccount: boolean = false;
  openAccountForm() {
    this.openAccount = true;
  }
  closeAccountForm() {
    this.openAccount = false;
  }
  creditAccounts: any = [];
  creditAccountsActive: any = [];
  creditAccountsDeActive: any = [];
  getCreditAccounts() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getCreditAccounts().subscribe((data) => {
      this.creditAccounts = data.filter((f: any) => f.userId == id);
      this.creditAccountsActive = data.filter((f: any) => f.active == true);
      this.creditAccountsDeActive = data.filter((f: any) => f.active == false);
      this.getCredit();
      console.log('acccc', this.creditAccountsDeActive);
    });
  }
  deleteCreditAccounts(id: any) {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this credit?'
    );
    if (isConfirmed) {
      const filterdCreditsForAccount = this.credits.filter(
        (f: any) => f.creditAccount == id
      );
      let filterdTransactionsForCredits: any = [];
      for (let val of filterdCreditsForAccount) {
        for (let vl of this.tansactions) {
          if (val.id == vl.creditId) {
            const exist = filterdTransactionsForCredits.find(
              (f: any) => f.id == vl.id
            );
            if (!exist) {
              filterdTransactionsForCredits.push(vl);
              this.categoriesServiceFire
                .deleteTransaction(vl.id)
                .then((data) => {
                  this.categoriesServiceFire
                    .deleteCredit(val.id)
                    .then((data) => {
                      this.getCreditAccounts();
                      this.categoriesServiceFire
                        .deleteCreditAccount(id)
                        .then((data) => {
                          // alert(`deleted account with id${id}`);
                          this.getCreditAccounts();
                        });
                    });
                });
            }
          }
        }
      }
    }
  }

  deleteCredit(id: any) {
    let doc = this.tansactions.find((f: any) => f.creditId == id);
    console.log('idthis', doc, id, this.tansactions);
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this credit?'
    );
    if (isConfirmed) {
      if (doc) {
        this.categoriesServiceFire
          .deleteTransaction(doc.id)
          .then(() => {
            alert('deleted transaction');
            this.getCreditAccounts();
            this.categoriesServiceFire
              .deleteCredit(id)
              .then(() => {
                this.getCreditAccounts();
                alert('deleted credit');
              })
              .catch((error) => {
                console.error('Error deleting credit:', error);
              });
          })
          .catch((error) => {
            console.error('Error deleting credit:', error);
          });
      } else {
        this.categoriesServiceFire
          .deleteCredit(id)
          .then(() => {
            this.getCreditAccounts();
            alert('deleted credit without transaction');
          })
          .catch((error) => {
            console.error('Error deleting credit:', error);
          });
      }
    }
  }

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
  docId: any;
  mode: any;
  open: any;
  accountId: any;
  openForm(id: any, mode: string, accountId: any) {
    this.open = true;
    this.docId = id;
    this.accountId = accountId;
    console.log('mode123', accountId);
    this.mode = mode;
    if (mode == 'edit') {
      this.categoriesServiceFire.getSingleCredit(id).subscribe((data) => {
        const { amount, date, duration, status, id } = data;
        this.creditForm.setValue({
          amount,
          date,
          duration,
          status,
          creditAccount: accountId,
        });
      });
    } else {
      this.creditForm.setValue({
        amount: '',
        date: '',
        duration: '',
        status: '',
        creditAccount: null,
      });
    }
  }

  closeForm() {
    this.open = false;
  }
  async saveCredit() {
    const storage = getStorage();
    try {
      // if (this.image) {
      //   const imageRef = ref(storage, `images/${this.image.name}`);
      //   const snapshot = await uploadBytes(imageRef, this.image);
      //   this.setimageURL = await getDownloadURL(snapshot.ref);
      // }
      const newData = {
        ...this.creditForm.value,
        // imageUrl: this.setimageURL,
        active: true,
      };
      await this.categoriesServiceFire.addCredits(newData);
      this.getCreditAccounts();
    } catch (error) {
      console.error('Error saving credit:', error);
      alert('An error occurred while saving the credit. Please try again.');
    }
  }
  async saveCreditAccounts() {
    try {
      const newData = {
        ...this.creditAccountForm.value,
        active: true,
      };
      await this.categoriesServiceFire.addCreditAccounts(newData);
      this.getCreditAccounts();
      this.closeAccountForm();
    } catch (error) {
      console.error('Error saving credit:', error);
      alert('An error occurred while saving the credit. Please try again.');
    }
  }

  updateCreditAccounts(id: any, val: boolean) {
    try {
      const newData = {
        id: id,
        active: val,
      };
      this.categoriesServiceFire.editCreditsAccount(newData).then((data) => {
        this.getCreditAccounts();
      });
    } catch (error) {
      console.error('Error saving credit:', error);
      alert('An error occurred while saving the credit. Please try again.');
    }
  }
  async updateCredit() {
    const storage = getStorage();

    try {
      // if (this.image) {
      //   const imageRef = ref(storage, `images/${this.image.name}`);
      //   const snapshot = await uploadBytes(imageRef, this.image);
      //   this.setimageURL = await getDownloadURL(snapshot.ref);
      // }
      const newData = {
        ...this.creditForm.value,
        // imageUrl: this.setimageURL,
        creditAccount: this.accountId,
        active: true,
        id: this.docId,
      };
      console.log('newDataaaa', newData);
      await this.categoriesServiceFire.editCredits(newData);
      this.creditForm.setValue({
        amount: '',
        date: '',
        duration: '',
        status: '',
        creditAccount: null,
      });
      this.mode = '';
      this.getCreditAccounts();
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
        (f: any) => f.active == true && f.userId == id
      );
      this.credits3 = data.filter(
        (f: any) => f.active !== true && f.userId == id
      );
      console.log('credits2', this.credits3);
      this.getTotal();
      this.getTransaction();
    });
    this.getTotal();
  }

  getTotal() {
    for (let val of this.credits3) {
      this.toatalCreditReturned += Number(val.amount);
    }
  }
  trnsactionForm = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
  });
  addTransaction(creditId: any) {
    const data = { ...this.trnsactionForm.value, creditId: creditId };
    this.categoriesServiceFire.addTransaction(data).then((data: any) => {});
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
          // exist total

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
    console.log('trans', this.credits2);
    this.compainCreditTransactionWithAccounts();
  }
  active = true;
  allDataBothActiveDeactive: boolean = false;
  changeAllDataBothActiveDeactivePass() {
    this.allDataBothActiveDeactive = true;
    this.getCreditAccounts();
  }
  changeAllDataBothActiveDeactive() {
    this.allDataBothActiveDeactive = false;
    this.getCreditAccounts();
  }
  compainCreditTransactionWithAccounts() {
    for (let val of this.creditAccounts) {
      val.credits = val.credits || [];
      val.total = 0;
      for (let v of this.credits) {
        if (!this.allDataBothActiveDeactive) {
          if (val.id === v.creditAccount && v.active == this.active) {
            const exist = val.credits.find((f: any) => f.id == v.id);
            if (!exist) {
              val.credits.push(v);
              val.total += Number(v.amount);
            }
          }
        } else {
          if (val.id === v.creditAccount) {
            const exist = val.credits.find((f: any) => f.id == v.id);
            if (!exist) {
              val.credits.push(v);
              val.total += Number(v.amount);
            }
          }
        }
      }
    }
    setTimeout(() => {
      this.calculateTotals();
    }, 2000);
  }
  changeActive() {
    this.active = false;
    this.getCreditAccounts();
    this.allDataBothActiveDeactive = false;
  }
  changeActivePass() {
    this.active = true;
    this.getCreditAccounts();
    this.allDataBothActiveDeactive = false;
  }
  calculateTotals() {
    let exst = 0;
    for (let val of this.creditAccountsActive) {
      for (let v of val.credits) {
        console.log('accountsAfter23000ppppppp', v.existing);
        exst += Number(v.existing);
        val.exist = exst;
      }
    }
    console.log('accountsAfter2300000000', this.creditAccountsActive);
  }

  hide: boolean = false;
  deActiveFile(id: any) {
    this.hide = false;
    const data = { id: id, hide: this.hide };
    this.categoriesServiceFire.hideFile(data).then((data: any) => {
      this.getCreditAccounts();
    });
  }
  activeFile(id: any) {
    this.hide = true;
    const data = { id: id, hide: this.hide };
    this.categoriesServiceFire.hideFile(data).then((data: any) => {
      this.getCreditAccounts();
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
