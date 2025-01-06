import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-commission-details',
  templateUrl: './commission-details.component.html',
  styleUrls: ['./commission-details.component.css'],
})
export class CommissionDetailsComponent {
  ngOnInit(): void {
    this.getDetails();
  }
  constructor(
    private route: ActivatedRoute,
    private categoriesServiceFire: CategoryFireService
  ) {}
  id = this.route.snapshot.paramMap.get('id');
  details: any;
  chartOptions: any;
  getDetails() {
    this.categoriesServiceFire
      .getCommissionsById(this.id as string | undefined)
      .subscribe((data: any) => {
        this.details = data;

        const today = new Date();
        const day = this.details.day;
        const date1 = new Date(day);
        const deff = date1.getTime() - today.getTime();
        const differenceInDays = Math.floor(deff / (1000 * 60 * 60 * 24));
        this.details.deff = Math.abs(differenceInDays);
        this.details.expTime = Math.floor(
          (Number(this.details.deff) * 100) / Number(this.details.guarantee)
        );
        this.details.gTime = 100 - this.details.expTime;
        if (this.details.gTime <= 0) {
          this.details.gTime = 0;
        }

        const age = this.convertDaysToYearsMonthsDays(this.details.deff);
        this.details.age = age;

        this.chartOptions = {
          animationEnabled: true,
          title: {
            text: `Guarantee: ${this.details.guarantee} days`,
          },
          data: [
            {
              type: 'doughnut',
              yValueFormatString: "#,###.##'%'",
              indexLabel: '{name}',
              dataPoints: [
                { y: this.details.gTime, name: 'Guarantee' },
                { y: this.details.expTime, name: 'Expire' },
              ],
            },
          ],
        };
      });
    console.log('data', this.details);
  }
  updateCommission() {
    const updatedData = {
      id: this.id,
      active: this.details.active == false ? true : false,
    };
    this.categoriesServiceFire.updateCommission(updatedData).then((data) => {
      this.getDetails();
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
}
