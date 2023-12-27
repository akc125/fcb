import { CategoriesService } from "src/services/categories.service";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-commission",
  templateUrl: "./commission.component.html",
  styleUrls: ["./commission.component.css"],
})
export class CommissionComponent {
  ngOnInit(): void {
    this.getCommission();
  }
  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}
  userId = localStorage.getItem("userId");
  status = false;
  open() {
    this.status = true;
  }
  close() {
    this.status = false;
  }
  file: any;
  handleFile(event: any) {
    this.file = event.target.files[0];
    console.log("file", event.target.files[0]);
  }
  commissionGroup = new FormGroup({
    userid: new FormControl(this.userId),
    name: new FormControl(),
    description: new FormControl(),
    active: new FormControl(true),
    date: new FormControl(),
    amount: new FormControl(),
    guarantee: new FormControl(),
    dedate: new FormControl(23),
  });

  addCommissions() {
    const formData = new FormData();
    formData.append("myFile", this.file);
    const names = [
      "userid",
      "name",
      "description",
      "active",
      "date",
      "amount",
      "guarantee",
      "dedate",
    ];
    names.forEach((name: any) => {
      const value = this.commissionGroup.get(name)?.value;
      if (value !== undefined) {
        formData.append(name, value);
      }
    });
    this.categoriesService.addCommission(formData).subscribe((data) => {
      this.getCommission();
    });
  }
  commission: any = [];
  chartOptions: any = [];
  getCommission() {
    this.categoriesService.getCommissions().subscribe((data: any) => {
      this.commission = data.filter((f: any) => f.userId == this.userId);
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
        this.chartOptions.push(chartOptions);
        console.log("age", differenceInDays);
      }
      console.log("data", this.commission);
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
