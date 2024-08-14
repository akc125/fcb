import { Router } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { TradService } from "./../../services/trad.service";
import { Component } from "@angular/core";

@Component({
  selector: "app-trad3",
  templateUrl: "./trad3.component.html",
  styleUrls: ["./trad3.component.css"],
})
export class Trad3Component {
  ngOnInit(): void {
    this.getSeasons();
    this.getTrads();
    this.collabrateDaysAndTrads();
  }

  userId = localStorage.getItem("userId");
  constructor(private TradService: TradService, private router: Router) {}
  tradForm = new FormGroup({
    trad: new FormControl(),
    status: new FormControl(),
    earnings: new FormControl(),
    failReason: new FormControl(),
    description: new FormControl(),
    type: new FormControl(),
    userId: new FormControl(this.userId),
  });
  formControles: any = [
    "trad",
    "status",
    "earnings",
    "failReason",
    "description",
    "type",
    "userId",
  ];
  file: any;

  onFile(event: any) {
    this.file = event.target.value;
    console.log("file", event.target.value);
  }
  trads: any = [];
  userDays: any = [];
  seasonId: any;
  successTotal: any = 0;
  failsTotal: any = 0;
  succArray: any = [];
  getTrads() {
    this.TradService.getTrads().subscribe((data: any) => {
      this.trads = data.filter(
        (f: any) => f.userId == this.userId && f.seasonId == this.seasonId
      );

      this.successTotal = data.filter(
        (f: any) => f.success == 1 && f.seasonId == this.seasonId
      );
      this.failsTotal = data.filter(
        (f: any) => f.success == 0 && f.seasonId == this.seasonId
      );

      this.collabrateDaysAndTrads();
    });
  }
  id: any;
  addId(id: any) {
    this.id = id;
  }
  status: any;
  addStatus(val: any) {
    this.status = val;
  }

  addTrad() {
    const tradForms = new FormData();
    tradForms.append("myFile", this.file);
    tradForms.append("daysId", this.id);
    tradForms.append("seasonId", this.seasonId);
    const status = this.tradForm.get("status")?.value;

    for (let val of this.formControles) {
      tradForms.append(val, this.tradForm.get(val)?.value);
      console.log("tradForms", tradForms, this.tradForm.get("status")?.value);
    }
    this.TradService.addTrad(tradForms).subscribe((data) => {
      this.getSeasons();
      this.closeForm();
      this.getTrads();
    });
    console.log("tradForms", tradForms, this.file);
  }
  seasons: any = [];

  getSeasons() {
    this.TradService.getSeasons().subscribe((data: any) => {
      this.seasons = data.data.filter((f: any) => f.userId == this.userId);
      const currentSeason = this.seasons[this.seasons.length - 1];
      this.seasonId = currentSeason.id;
      this.TradService.getDaysInfo().subscribe((data: any) => {
        var days = data.data.filter(
          (f: any) => f.userId == this.userId && f.seasonId == currentSeason.id
        );
        this.userDays = days;
      });
      setTimeout(() => {
        this.collabrateDaysAndTrads();
      }, 100);
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
  open: any = false;
  openForm() {
    this.open = true;
  }
  closeForm() {
    this.open = false;
    this.collabrateDaysAndTrads();
  }
  dateInfos: any = [];
  earnings: any;
  loos: any;
  tad_pair:any=[];
  collabrateDaysAndTrads() {
    for (let val of this.userDays) {
      const successArray = [];
      const failedArray = [];
      const earnings = [];
      const losss = [];
      for (let v of this.trads) {
        if (val.id == v.daysId) {
          val.trad = v.trad;
          if (v.success == 1) {
            successArray.push(v);
            earnings.push(v.earnings);
          } else if (v.success == 0) {
            failedArray.push(v);
            losss.push(v.earnings);
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
          let sum = 0;
          for (let vf of earnings) {
            sum += vf;
          }
          val.ea = sum;
          let sum3 = 0;
          for (let vf of losss) {
            sum3 += vf;
          }
          val.eaLoos = sum3;
        }
        let sum2 = 0;
        for (let val of this.userDays) {
          if (val.ea) {
            sum2 += val?.ea;
          }
        }
        this.earnings = sum2;
        let sum5 = 0;
        for (let val of this.userDays) {
          if (val.eaLoos) {
            sum5 += val?.eaLoos;
          }
        }
        this.loos = sum5;
      }
      let sucLength: any = "";
      var count=0
      var count2=0
      var count3=0
      var count4=0
      var count5=0
      var count6=0
      var count7=0
      for (let val of this.userDays) {
        sucLength = val.sArray?.length;
      }
      for (let v of this.userDays) {
        if (v.sArray) {
          // let exst=this.succArray.find((f:any)=>f==v.trad)      
            for (let vl of v.sArray) {
if(vl.trad=='AUD-CAD'){
  count+=1
}          
if(vl.trad=='EUR-USD'){
  count2+=1
}          
if(vl.trad=='EUR-JPY'){
  count3+=1
}          
if(vl.trad=='AUD-USD'){
  count4+=1
}          
if(vl.trad=='NSD-USD'){
  count+=1
}          
if(vl.trad=='USD-CHF'){
  count5+=1
}          
if(vl.trad=='USD-JPY'){
  count6+=1
}     
this.tad_pair.push     
          }
         
        }
      }    console.log("trads", this.userDays, this.succArray,count);
    }

  }
  mathFix(val: any) {
    return Math.round(val);
  }
  addStatusReport() {
    const data = {
      seasonId: this.seasonId,
      success: this.successTotal?.length,
      fail: this.failsTotal?.length,
      userId: this.userId,
      earnings: this.earnings,
      day: new Date(),
      loos: this.loos,
    };
    this.TradService.addSttusReport(data).subscribe((data) => {});
  }
  updateSeason() {
    const data = "finished";
    this.TradService.updateSeasons(data, this.seasonId).subscribe((data) => {
      this.router.navigate(["/trad"]);
    });
  }
}
