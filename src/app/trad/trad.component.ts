import { TradService } from "./../../services/trad.service";
import { Component } from "@angular/core";
import { Route, Router } from "@angular/router";

@Component({
  selector: "app-trad",
  templateUrl: "./trad.component.html",
  styleUrls: ["./trad.component.css"],
})
export class TradComponent {
  ngOnInit(): void {
    this.getDyas();
    this.getSeasons();
    this.getTrads();
    this.getStatusReport();
  }
  constructor(private router: Router, private TradService: TradService) {}
  userId = localStorage.getItem("userId");
  trads: any;
  seasonId: any;
  seasons: any = [];
  successTotal: any = 0;
  failsTotal: any = 0;
  status: any;
  getTrads() {
    this.TradService.getTrads().subscribe((data: any) => {
      this.trads = data.filter((f: any) => f.userId == this.userId);
      this.successTotal = this.trads.filter((f: any) => f.success == 1);
      this.failsTotal = this.trads.filter((f: any) => f.success == 0);
      this.collabrateDaysAndTrads();
    });
  }
  getSeasons() {
    this.TradService.getSeasons().subscribe((data: any) => {
      this.seasons = data.data.filter((f: any) => f.userId == this.userId);
      const currentSeason = this.seasons[this.seasons.length - 1];
      this.seasonId = currentSeason?.id;
      this.status = currentSeason?.status;
      this.getTrads();
      this.collabrateDaysAndTrads();
      this.getStatusReport();
    });
  }
  mathRound(val: any) {
    return Math.round(val);
  }
  successNum: any;
  failNum: any;
  earnings: any;
  loos: any;
  getStatusReport() {
    this.TradService.getStatusReport().subscribe((data: any) => {
      const data2 = data.filter((f: any) => f.userId == this.userId);
      let s = 0;
      let a = 0;
      let b = 0;
      let d = 0;
      for (let val of this.seasons) {
        for (let v of data2) {
          if (val.id == v.seasonId) {
            val.success = v.success;
            val.fail = v.fail;
            this.successNum = v.success;
            this.failNum = v.fail;
            s += v.earnings;
            a += v.loos;
            this.earnings = s;
            this.loos = a;
          }
        }
      }
    });
  }
  chartOptions = {
    animationEnabled: true,
    title: {
      // text: "Project Cost Breakdown"
    },
    data: [
      {
        type: "doughnut",
        yValueFormatString: "#,###.##'%'",
        indexLabel: "{name}",
        dataPoints: [
          { y: 28, name: "Labour" },
          { y: 10, name: "Legal" },
          { y: 20, name: "Production" },
          { y: 15, name: "License" },
          { y: 23, name: "Facilities" },
          { y: 17, name: "Taxes" },
          { y: 12, name: "Insurance" },
        ],
      },
    ],
  };

  userDays: any = [];

  getDyas() {
    this.TradService.getDaysInfo().subscribe((data: any) => {
      var days = data.data.filter((f: any) => f.userId == this.userId);
      this.userDays = days;
      const currentSeason = this.userDays[this.userDays.length - 1];
      this.collabrateDaysAndTrads();
    });
  }
  routers() {
    console.log("status", this.status);
    if (this.status == "finished") {
      this.router.navigate(["/trad/2"]);
    } else {
      this.router.navigate(["/trad3"]);
    }
    if (this.userDays.length == 0) {
      this.router.navigate(["/trad/2"]);
    }
  }
  seasonDetails() {
    this.router.navigate(["/trad3"]);
  }
  collabrateDaysAndTrads() {
    for (let val of this.userDays) {
      const successArray = [];
      const failedArray = [];
      for (let v of this.trads) {
        if (val.id == v.daysId) {
          val.trad = v.trad;
          if (v.success == 1) {
            successArray.push(v);
          } else if (v.success == 0) {
            failedArray.push(v);
          }
          val.sArray = successArray;
          val.fArray = failedArray;
          if (successArray.length > failedArray.length) {
            val.st = 1;
          } else if (successArray.length == failedArray.length) {
            val.st = 2;
          } else {
            val.st = 0;
          }
        }
      }
      let sucLength: any = "";
      for (let val of this.userDays) {
        sucLength = val.sArray?.length;
      }
    }
  }
}
