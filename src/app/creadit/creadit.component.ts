import { CategoriesService } from "src/services/categories.service";
import { Component } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
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
  selector: "app-creadit",
  templateUrl: "./creadit.component.html",
  styleUrls: ["./creadit.component.css"],
})
export class CreaditComponent {
  ngOnInit(): void {
    this.getCredit();
    this.getTransaction();
  }
  constructor(private categoriesService: CategoriesService) {}
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
  onSelect(event: any) {
    const selectedFile = event.target.files[0];
    this.sendFile = event.target.files[0];
    if (selectedFile) {
      // Generate a data URL from the selected file and set it to 'file'.
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.file = e.target.result;
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // If no file is selected, clear the 'file' variable.
      this.file = null;
    }
  }

  open: any;
  openForm() {
    this.open = true;
  }
  closeForm() {
    this.open = false;
  }
  saveCredit() {
    const formData = new FormData();
    const userId = localStorage.getItem("userId");

    // Define an object that maps form control names to their values
    const formControls: { [key: string]: string } = {
      name: "name",
      amount: "amount",
      date: "date",
      duration: "duration",
      address: "address",
      status: "status",
      contact: "contact",
    };

    // Loop through the form controls and append them to formData
    for (const key in formControls) {
      if (formControls.hasOwnProperty(key)) {
        const controlName = formControls[key];
        const controlValue = this.creditForm.get(controlName)?.value;
        formData.append(key, controlValue);
      }
    }

    // Append userId if it exists
    if (userId !== null) {
      formData.append("userId", userId);
    }

    // Append the file
    formData.append("myFile", this.sendFile);

    this.categoriesService.addCredits(formData).subscribe((data: any) => {
      alert("posted successfully");
      this.getCredit();
    });
  }

  credits: any = [];
  credits2: any = [];
  personsTogiveMony: any;
  getCredit() {
    const id = localStorage.getItem("userId");
    this.categoriesService.getCredits().subscribe((data: any) => {
      this.credits = data.filter((f: any) => f.userId == id);
      this.credits2 = data.filter(
        (f: any) => f.active !== "true" && f.userId == id
      );
      console.log("credits", this.credits);
    });
  }
  trnsactionForm = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
  });
  addTransaction(creditId: any) {
    const data = { ...this.trnsactionForm.value, creditId: creditId };
    this.categoriesService.addTransaction(data).subscribe((data: any) => {
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
    const id = localStorage.getItem("userId");
    const incomes = localStorage.getItem("income");
    const expense = localStorage.getItem("expense");
    this.currentIncome = incomes;
    this.expense = expense;
    this.categoriesService.getTransactions().subscribe((data: any) => {
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
          val.total = transactions.reduce((sum: any, v: any) => {
            let ans = (sum += v.amount);
            return ans;
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
        sum = sum + v.amount;
        for (let b of v.transaction) {
          returnedAmount += b.amount;
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
    this.hide = true;
    const data = { id: id, hide: this.hide };
    this.categoriesService.hideFile(data).subscribe((data: any) => {
      this.getCredit();
      this.getTransaction();
    });
  }
  activeFile(id: any) {
    this.hide = false;
    const data = { id: id, hide: this.hide };
    this.categoriesService.hideFile(data).subscribe((data: any) => {
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
