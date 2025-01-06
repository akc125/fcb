import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { FormControl, FormControlName, FormGroup } from '@angular/forms';
import { CategoryFireService } from 'src/services/category-fire.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
@Component({
  selector: 'app-debit',
  templateUrl: './debit.component.html',
  styleUrls: ['./debit.component.css'],
})
export class DebitComponent {
  ngOnInit(): void {
    this.getDebits();
    this.getDebitAmounts();
    this.combainData();
  }
  constructor(
    private categoriesServiceFire: CategoryFireService
  ) {}

  userId = localStorage.getItem('userId');
  debitFormGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    date: new FormControl(),
    amount: new FormControl(),
    userId: new FormControl(this.userId),
    active: new FormControl(1),
  });
  debitAmountFormGroup = new FormGroup({
    amount: new FormControl(),
    date: new FormControl(),
  });
  file: any;
  mydate = '12/12/2023';
  handleFile(e: any) {
    this.file = e.target.files[0];
  }
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
  async addDebits() {
    try {
      const storage = getStorage();
      if (this.image) {
        const imageRef = ref(storage, `images/${this.image.name}`);
        const snapshot = await uploadBytes(imageRef, this.image);
        this.setimageURL = await getDownloadURL(snapshot.ref);
      }

      const newData = {
        ...this.debitFormGroup.value,
        image: this.setimageURL,
      };
      this.categoriesServiceFire.addDebit(newData).then((data) => {
        this.getCloseMainForm();
        this.getDebits();
      });
    } catch (error) {
      console.error('Error saving credit:', error);
      alert('An error occurred while saving the credit. Please try again.');
    }
  }
  addDebitAmount(id: any) {
    const data = {
      amount: this.debitAmountFormGroup.get('amount')?.value,
      date: this.debitAmountFormGroup.get('date')?.value,
      cardId: id,
      userId: this.userId,
    };
    this.categoriesServiceFire.addDebitAmount(data).then((data) => {
      this.getCloseForm();
      this.getDebitAmounts();
    });
  }
  debits: any = ([] = []);
  getDebits() {
    this.categoriesServiceFire.getDebit().subscribe((data: any) => {
      this.debits = data.filter((f: any) => f.userId == this.userId);
      this.combainData();
      console.log('debits', this.debits);
    });
  }
  debitAmounts: any = ([] = []);
  getDebitAmounts() {
    this.categoriesServiceFire.getDebitAmount().subscribe((data: any) => {
      this.debitAmounts = data;
      this.combainData();
    });
  }
  totalCards: any;
  totalAmount: any;
  combainData() {
    let total = 0;

    for (let val of this.debits) {
      if (val.active == 1) {
        total += Number(val.amount);
        this.totalAmount = total;
      }

      val.amountData = this.debitAmounts.filter((f: any) => {
        return f.userId == this.userId && f.cardId == val.id;
      });
      var sum = 0;
      for (let v of val.amountData) {
        sum += Number(v.amount);
        val.total = sum;
        val.exist = Number(val.amount) - Number(val.total);
        if (val.total == 0) {
          val.exist = val.amount;
        }
      }
    }
    const cards = this.debits.filter((f: any) => f.active == 1);
    this.totalCards = cards.length;
    console.log('cardssss', cards);
  }
  updateDebit(id: any) {
    const data = {
      active: 0,
      id: id,
    };
    this.categoriesServiceFire.updateDebit(data).then((data) => {
      this.getDebits();
      this.combainData();
    });
  }
  active(id: any) {
    const data = {
      active: 1,
      id: id,
    };
    this.categoriesServiceFire.updateDebit(data).then((data) => {
      this.getDebits();
      this.combainData();
    });
  }
  open: any = false;
  getOpen() {
    this.open = true;
  }
  getClose() {
    this.open = false;
  }
  openForm: any = false;
  formId: any;
  getOpenForm(id: any) {
    this.openForm = true;
    this.formId = id;
  }
  getCloseForm() {
    this.openForm = false;
  }
  openMainForm: any = false;
  getOpenMainForm() {
    this.openMainForm = true;
  }
  getCloseMainForm() {
    this.openMainForm = false;
  }
}
