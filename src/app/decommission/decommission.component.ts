import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-decommission',
  templateUrl: './decommission.component.html',
  styleUrls: ['./decommission.component.css'],
})
export class DecommissionComponent {
  ngOnInit(): void {
    this.getCommission();
  }
  constructor(
    private categoriesServiceFire: CategoryFireService,
    private router: Router
  ) {}

  commission: any = [];
  chartOptions: any = [];
  userId = localStorage.getItem('userId');
  getCommission() {
    this.categoriesServiceFire.getCommissions().subscribe((data: any) => {
      this.commission = data.filter(
        (f: any) => f.userId == this.userId && f.active === false
      );
      const today = new Date();
      for (let val of this.commission) {
        const day = val.day;
        const date1 = new Date(day);
        const deff = date1.getTime() - today.getTime();
        const differenceInDays = Math.floor(deff / (1000 * 60 * 60 * 24));
        val.deff = Math.abs(differenceInDays);
        val.expTime = Math.floor(
          (Number(val.deff) * 100) / Number(val.guarantee)
        );
        val.gTime = 100 - val.expTime;
        if (val.gTime <= 0) {
          val.gTime = 0;
        }
        const age = this.convertDaysToYearsMonthsDays(val.deff);
        val.age = age;
        const chartOptions = {
          animationEnabled: true,
          title: {
            text: `Guarantee: ${val.guarantee} days`,
          },
          data: [
            {
              type: 'doughnut',
              yValueFormatString: "#,###.##'%'",
              indexLabel: '{name}',
              dataPoints: [
                { y: val.gTime, name: 'Guarantee' },
                { y: val.expTime, name: 'Expaire' },
              ],
            },
          ],
        };
        this.chartOptions.push(chartOptions);
        console.log('age', differenceInDays);
      }
      console.log('data', this.commission);
    });
  }
  updateCommission(id: any) {
    this.categoriesServiceFire.updateCommission(id).then((data) => {
      this.getCommission();
    });
  }
  convertDaysToYearsMonthsDays(totalDays: number): {
    years: number;
    months: number;
    days: number;
  } {
    const years = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = totalDays % 365.25;
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const remainingDaysAfterMonths = remainingDaysAfterYears % 30.44;
    return { years, months, days: Math.round(remainingDaysAfterMonths) };
  }
  goToDetails(id: any) {
    this.router.navigate([`commissionDetails/${id}`]);
  }
}
