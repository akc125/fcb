import { CategoriesService } from "src/services/categories.service";
import { TradService } from "./../../services/trad.service";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-trad2",
  templateUrl: "./trad2.component.html",
  styleUrls: ["./trad2.component.css"],
})
export class Trad2Component {
  ngOnInit(): void {}
  constructor(private router: Router, private TradService: TradService) {}
  dateFormGroup = new FormGroup({
    firstDate: new FormControl(),
    secondDate: new FormControl(),
  });
  check: boolean = false;
  dateInfo: any = [];
  seasons: any = [];
  userId = localStorage.getItem("userId");
  getSeasons() {
    this.TradService.getSeasons().subscribe((data: any) => {
      this.seasons = data.data.filter((f: any) => f.userId == this.userId);
      const ind = data.data.length;
      this.addSeasons(ind);
    });
  }

  addSeasons(ind: any) {
    console.log("ind", ind);
    const userId = localStorage.getItem("userId");
    this.TradService.addSeason({
      name: `season${ind + 1}`,
      userId: userId,
      status: "running",
    }).subscribe((data) => {
      this.TradService.getSeasons().subscribe((data: any) => {
        this.seasons = data.data.filter((f: any) => f.userId == this.userId);
        const datas = data.data.filter((f: any) => f.userId == this.userId);
        const ind = datas.length;
        const seasonObj = datas[datas.length - 1];
        this.formValue(seasonObj.id);
      });
    });
  }

  formValue(id: any) {
    const firstDate = this.dateFormGroup.get("firstDate")?.value;
    const secondDate = this.dateFormGroup.get("secondDate")?.value;

    let fdate = new Date(firstDate);
    let secdate = new Date(secondDate);
    const userId = localStorage.getItem("userId");
    this.dateInfo = [];
    for (
      let fsDate = fdate;
      fsDate <= secdate;
      fsDate.setDate(fsDate.getDate() + 1)
    ) {
      this.dateInfo.push(this.dateArrange(fsDate));
    }

    console.log("dateInfo111", id, this.dateInfo);
    for (let val of this.dateInfo) {
      this.TradService.addDayInfo({
        dayName: val.dayName,
        day: val.dateNumber,
        month: val.month,
        userId: userId,
        seasonId: id,
      }).subscribe((data) => {});
    }

    if (
      this.check &&
      this.dateFormGroup.get("firstDate")?.value &&
      this.dateFormGroup.get("secondDate")?.value
    ) {
      this.router.navigate(["/trad3"]);
    }
    console.log("dateInfo", this.dateInfo);
  }

  private dateArrange(date: Date): {
    dateNumber: number;
    dayName: string;
    month: number;
  } {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dateNumber = date.getDate();
    const dayName = daysOfWeek[date.getDay()];
    const month = date.getMonth();
    return { dateNumber, dayName, month };
  }
}
