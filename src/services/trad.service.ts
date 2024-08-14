import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TradService {
  constructor(private http: HttpClient) {}
  publicEndPoint = "http://localhost:5000/daysInformation";

  addDayInfo(data: any) {
    console.log("dayinfo", data);
    return this.http.post(this.publicEndPoint, data);
  }

  getSeasons() {
    return this.http.get("http://localhost:5000/seasons", {});
  }
  getDaysInfo() {
    return this.http.get("http://localhost:5000/daysinfo", {});
  }
  getTrads() {
    return this.http.get("http://localhost:5000/trads", {});
  }
  addSeason(data: any) {
    console.log(data);
    return this.http.post("http://localhost:5000/seasons", data);
  }

  addTrad(data: any) {
    console.log("addtrad", data);
    data.forEach((value: any, key: any) => {
      console.log("addtrad2", key, value);
    });
    return this.http.post("http://localhost:5000/trads", data);
  }
  updateSeasons(data: any, id: any) {
    console.log("update", data, id);
    return this.http.patch(`http://localhost:5000/seasons/${id}`, data);
  }

  addSttusReport(data: any) {
    return this.http.post("http://localhost:5000/statusReport", data);
  }
  getStatusReport(){
    return this.http.get('http://localhost:5000/statusReport',{})
  }
}
