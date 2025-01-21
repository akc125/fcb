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
  totalMonyAccount: any;
  combainData() {
    const id = localStorage.getItem('userId');
    let total = 0;
    let total2 = 0;
    for (let val of this.debits) {
 
      val.paid = false;
      val.amountData = this.debitAmounts.filter((f: any) => {
        return f.userId == id && f.cardId == val.id;
      });
      var sum = 0;
      for (let v of val.amountData) {
        sum += Number(v.amount);
        val.total = sum;
        val.paid = true;
      }
      if (val.paid) {
        val.exist = Number(val.amount) - Number(val.total);
      } else {
        val.exist = Number(val.amount);
      }
      setTimeout(() => {
        if (val.active == 1 && val.moneyAccount == true) {
          total += Number(val.exist) || 0;
          this.totalAmount = total;
        }

        if (val.active == 1 && val.moneyAccount == false) {
          console.log('cardssssssssssssssssssssssssssssssssssss', val.id,this.debits);
          total2 += Number(val.exist) || 0;
          this.totalMonyAccount = total2;
        }
      }, 1000);
    }
    const cards = this.debits.filter((f: any) => f.active == 1);
    this.totalCards = cards.length;
  }

  getCredit() {
    const id = localStorage.getItem('userId');
    this.categoriesServiesFire.getCredits().subscribe((data: any) => {
      this.credits = data.filter((f: any) => f.userId == id);

      this.credits.reverse();
      this.credits2 = data.filter(
        (f: any) => f.active == true && f.userId == id
      );
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
        }, 0) + 39035;
      this.compainExpAdIncom();
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

    this.incomeExpGrouping();
  }
  finalTableData: any = [];

  incomeExpGrouping() {
    const groupedData: any = {};

    this.incomes.forEach((income: any) => {
      const date = new Date(income.day);
      const year = date.getFullYear();
      const month = date.getMonth();

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
  }

  get MainTotal(): number {
    return Number(this.incomTotal) + Number(this.assets);
  }

  get MainTotalDebitCredit(): number {
    return Number(this.totalAmount);
  }
  get MainBalance(): number {
    console.log('log1MainTotalDebitCredit', this.MainTotalDebitCredit);
    console.log('log2expenseTotel', this.expenseTotel);
    console.log('log3ToTALaSSET', this.MainTotal);
    console.log('log3totalAmount', this.totalAmount);
    console.log('log3totalMonyAccount', this.totalMonyAccount);
    console.log('log3ToTAExsisting', this.totalExsisting);
    let worth = Number(this.MainTotal) + Number(this.MainTotalDebitCredit);
    let val = +Number(this.expenseTotel) + Number(this.totalExsisting);
    let ans = Number(worth) - Number(val);
    let answer = ans - Number(this.totalMonyAccount);
    return answer;
  }
  get OnHand(): number {
    let worth = Number(this.MainTotal) + Number(this.MainTotalDebitCredit);
    let val = +Number(this.expenseTotel) + Number(this.totalExsisting);
    let ans = Number(worth) - Number(val);
    let answer = ans - Number(this.totalMonyAccount);

    return answer - 260192;
  }
}
