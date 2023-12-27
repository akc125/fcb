import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-commission-details',
  templateUrl: './commission-details.component.html',
  styleUrls: ['./commission-details.component.css']
})
export class CommissionDetailsComponent {
  ngOnInit():void{
    this.getDetails()
  }
  constructor(private route:ActivatedRoute,private categoriesService:CategoriesService){}
 id=this.route.snapshot.paramMap.get("id")
 details:any=[]
 chartOptions:any;
getDetails(){
  this.categoriesService.getCommissionsById(this.id).subscribe((data:any)=>{
    this.details=data
    const today = new Date();
    for (let val of this.details) {
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
      this.chartOptions = {
        animationEnabled: true,
        title: {
          text: `Guarantee: ${val.guarantee} days`
        },
        data: [
          {
            type: "doughnut",
            yValueFormatString: "#,###.##'%'",
            indexLabel: "{name}",
            dataPoints: [
              { y: val.gTime, name: "Guarantee" },
              { y: val.expTime, name: "Expaire" },
            ],
          },
        ],
      };
    }
  })
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
