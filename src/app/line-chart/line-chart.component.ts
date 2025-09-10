import { Component, OnInit } from '@angular/core';
import { CategoryFireService } from 'src/services/category-fire.service';
import { ChartData, ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  defaultDate: string = '';
  year: number = 0;
  thisMonthExpense: any[] = [];
  expense: any[] = [];

  // Chart properties
  public lineChartData: ChartData<'line'> = {
    datasets: [],
    labels: [],
  };
  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#471643', // Stylish color
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `₹ ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
        grid: {
          // color: 'white', // Lighter grid color
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Expenses (₹)',
          color: 'white',
        },
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'white',
        },
      },
    },
  };

  constructor(private categoriesServiceFire: CategoryFireService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.defaultDate = currentDate.toISOString().substring(5, 7);
    this.getExpenses();
  }

  getExpenses() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getExpensList().subscribe((data) => {
      this.expense = JSON.parse(JSON.stringify(data)).filter((f: any) => f.userId == id);
      this.thisMonthExpense = this.expense.filter(
        (f: any) =>
          Number(f.day.substring(5, 7)) == Number(this.defaultDate) &&
          f.day.substring(0, 4) == this.year
      );

      this.updateChart();
    });
  }

  updateChart() {
    const dailyExpenses: { [key: string]: number } = {};
    const labels: string[] = [];
    const data: number[] = [];

    this.thisMonthExpense.forEach((expense) => {
      const date = expense.day; // Use full date
      dailyExpenses[date] = (dailyExpenses[date] || 0) + expense.expense;
    });

    // Sort days and calculate cumulative expenses
    const sortedDays = Object.keys(dailyExpenses).sort();
    let cumulativeExpense = 0;

    sortedDays.forEach((day) => {
      cumulativeExpense += dailyExpenses[day];
      labels.push(day); // Full date format for better readability
      data.push(cumulativeExpense);
    });

    // Update the chart data
    this.lineChartData = {
      labels,
      datasets: [
        {
          data,
          label: 'Cumulative Expenses',
          fill: true,
          backgroundColor: 'rgba(71, 12, 63, 0.2)', 
          borderColor: '#471643',
          pointBackgroundColor: 'blue', 
          tension: 0.4, // Smooth curve
        },
      ],
    };
  }
}
