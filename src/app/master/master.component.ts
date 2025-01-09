import { Component } from '@angular/core';
import { CategoriesService } from 'src/services/categories.service';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
})
export class MasterComponent {
  ngOnInit(): void {
    this.getIncomes();
    this.getExpenses();
    this.getAsset();
    this.getCredit();
    this.getTransaction();
    this.getDebits();
    this.getDebitAmounts();
    this.combainData();
  }
  constructor(private categoriesServiesFire: CategoryFireService) {}
  incomes: any = [];
  incomTotal: number = 0;
  toatalCreditReturned: number = 0;
  personsTogiveMony: any;
  incom_asset: any = 0;
  credit_debit: any = 0;
  lastBalance: any = 0;
  assets: any = 0;
  credits: any = [];
  retunedTotal: any;
  totalExsisting: any = 0;
  incomeWithCredit: any;
  balance: any;
  totalCredit: any;
  credits2: any = [];
  credits3: any = [];
  debits: any = ([] = []);
  getDebits() {
    const id = localStorage.getItem('userId');
    this.categoriesServiesFire.getDebit().subscribe((data: any) => {
      this.debits = data.filter((f: any) => f.userId == id);
      this.combainData();
      console.log('debits', this.debits);
    });
  }
  debitAmounts: any = ([] = []);
  getDebitAmounts() {
    this.categoriesServiesFire.getDebitAmount().subscribe((data: any) => {
      this.debitAmounts = data;
      this.combainData();
    });
  }
  totalCards: any;
  totalAmount: any;
  combainData() {
    const id = localStorage.getItem('userId');

    let total = 0;

    for (let val of this.debits) {
      if (val.active == 1) {
        total += Number(val.amount);
        this.totalAmount = total;
      }

      val.amountData = this.debitAmounts.filter((f: any) => {
        return f.userId == id && f.cardId == val.id;
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
  getCredit() {
    const id = localStorage.getItem('userId');
    this.categoriesServiesFire.getCredits().subscribe((data: any) => {
      this.credits = data.filter((f: any) => f.userId == id);

      this.credits.reverse();
      this.credits2 = data.filter(
        (f: any) => f.active == true && f.userId == id
      );
      console.log('credits', this.credits2);
      this.credits3 = data.filter(
        (f: any) => f.active !== true && f.userId == id
      );
      this.getTotal();
      this.getTransaction();
    });
    this.getTotal();
    this.getTransaction();
  }
  getTotal() {
    for (let val of this.credits3) {
      this.toatalCreditReturned += Number(val.amount);
    }
  }
  tansactions: any = [];
  getTransaction() {
    const id = localStorage.getItem('userId');
    // const incomes = localStorage.getItem('income');
    // const expense = localStorage.getItem('expense');
    // this.currentIncome = incomes;
    // this.expense = expense;
    this.categoriesServiesFire.getTransactions().subscribe((data: any) => {
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

          // val.income = Number(incomes) + Number(val.total || val.amount);
          // if (val.existing < 0) {
          //   val.income =
          //     Number(incomes) +
          //     Number(val.total || val.amount) +
          //     Number(val.overPaid);
          // }
          // val.currentIncome = incomes;
          // val.expense = expense;
          // val.balance = Number(val.income) - Number(expense);
          // val.crrentBalance = Number(incomes) - Number(expense);
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
      // this.incomeWithCredit = parseFloat(this.currentIncome) + Number(sum);
      // this.balance = this.incomeWithCredit - this.expense;
    });
    console.log('trans', this.credits2);
  }

  getAsset() {
    this.categoriesServiesFire.getAsset().subscribe((data) => {
      this.assets = data.map((p: any) => p.name);
    });
  }
  getIncomes() {
    const id = localStorage.getItem('userId');
    this.categoriesServiesFire.getIncomes().subscribe((data: any) => {
      this.incomes = data.filter((f: any) => {
        return f.userId == id;
      });
      for (let val of this.incomes) {
        this.incomTotal += val.amount;
      }
    });
  }

  expenses: any = [];
  expenseTotel: number = 0;
  getExpenses() {
    this.expenseTotel = 0; // Reset the total
    this.categoriesServiesFire.getExpensList().subscribe((data) => {
      this.expenses = data;
      this.expenseTotel =
        this.expenses.reduce((total: any, exp: any) => {
          const validExpense = exp.expense || 0;
          return total + validExpense;
        }, 0) + 4879;
      this.compainExpAdIncom();
      console.log('Total Expense for All Items:', this.expenseTotel);
    });
  }
  compainExpAdIncom() {
    for (let val of this.expenses) {
      for (let v of this.incomes) {
        if (
          new Date(val.day).getMonth().toString().padStart(2, '0') ==
          new Date(v.day).getMonth().toString().padStart(2, '0')
        ) {
          val.income = v.amount;
        }
      }
    }

    // let dv='2024-10-22'
    // let v=new Date(dv)
    // // const prevMonth = v > 0 ? dfltm : 12;
    // const MonthFormatted = v.getMonth().toString().padStart(2, '0');
    console.log('expppp', this.expenses);
    console.log('inccccc', this.incomes);
    this.incomeExpGrouping();
  }
  finalTableData: any = [];

  incomeExpGrouping() {
    // Group by year and month
    const groupedData: any = {};

    this.incomes.forEach((income: any) => {
      const date = new Date(income.day);
      const year = date.getFullYear();
      const month = date.getMonth(); // Get the month as a number (0 for Jan, 11 for Dec)

      if (!groupedData[year]) groupedData[year] = {};

      if (!groupedData[year][month])
        groupedData[year][month] = { income: 0, expense: 0 };

      groupedData[year][month].income += income.amount;
    });

    this.expenses.forEach((expense: any) => {
      const date = new Date(expense.day);
      const year = date.getFullYear();
      const month = date.getMonth(); // Get the month as a number (0 for Jan, 11 for Dec)

      if (!groupedData[year]) groupedData[year] = {};

      if (!groupedData[year][month])
        groupedData[year][month] = { income: 0, expense: 0 };

      groupedData[year][month].expense += expense.expense || 0;
    });

    // Prepare final table data
    this.finalTableData = [];
    for (const year in groupedData) {
      this.finalTableData.push({ year, isYear: true });

      // Sort months numerically
      const months = Object.keys(groupedData[year])
        .map((month) => parseInt(month))
        .sort((a, b) => a - b); // Sort months in ascending order

      months.forEach((month) => {
        const monthName = new Date(0, month).toLocaleString('default', {
          month: 'short',
        });
        const data = groupedData[year][month];
        const balance = data.income - data.expense;

        this.finalTableData.push({
          year,
          month: monthName,
          income: data.income,
          expense: data.expense,
          balance,
        });
      });
    }

    console.log('Final Table Data:', this.finalTableData);
  }

  get MainTotal(): number {
    return Number(this.incomTotal) + Number(this.assets);
  }

  get MainTotalDebitCredit(): number {
    if (Number(this.totalExsisting) > Number(this.totalAmount)) {
      return Number(this.totalExsisting) - Number(this.totalAmount);
    } else {
      return Number(this.totalAmount) - Number(this.totalExsisting);
    }
  }
  get MainBalance(): number {
    return (
      Number(this.MainTotal) -
      Number(this.MainTotalDebitCredit) -
      this.expenseTotel
    );
  }
  get OnHand(): number {
    let ans = Number(this.incomTotal) - Number(this.expenseTotel);
    return ans + 27817;
  }
}
