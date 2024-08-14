import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { CategoriesService } from "src/services/categories.service";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.css"],
})
export class NotificationComponent {
  ngOnInit(): void {
    this.getCtegories();
    this.getActions();
  }
  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}
  userId = localStorage.getItem("userId");
  categoryForm = new FormGroup({
    name: new FormControl(),
    userId: new FormControl(this.userId),
    duration: new FormControl(),
    type: new FormControl(""),
  });
  file: any;
  sendFile: any;
  NotificationCategory: any;
  handleFile(event: any) {
    const selectedFile = event.target.files[0];
    this.sendFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.file = e.target.result;
      };
      reader.readAsDataURL(selectedFile);
    } else {
      this.file = null;
    }
  }
  actions: any[] = [];
  newActions: any[] = [];
  latestAction: any = [];
  sendSms(msg: any) {
    const data = {
      message: msg,
      phone: 919656207607,
    };
    this.categoriesService.sendSms(data).subscribe((data) => {});
  }
  sendEmail(message: any) {
    const data = {
      message: message,
      phone: 919656207607,
    };
    this.categoriesService.sendEmail(data).subscribe((data) => {}),
      (err: any) => {
        console.log("errors", err);
      };
  }
  getActions() {
    this.categoriesService.getNotificationAndAction().subscribe((data: any) => {
      this.actions = data.filter((f: any) => f.userId == this.userId);
      let lastElementMap: { [categoryId: string]: any } = {};
      for (let val of this.actions) {
        lastElementMap[val.categoryId] = val;
        const date1 = new Date(val.day);
        const date2 = new Date();
        const timeDefference = date1.getTime() - date2.getTime();
        const differenceInDays = Math.floor(
          timeDefference / (1000 * 60 * 60 * 24)
        );
        val.timeDefference = Math.abs(differenceInDays);
        const existingTime = val.updatedDuration - Math.abs(differenceInDays);
        val.existingTime = existingTime;
      }
      this.newActions = Object.values(lastElementMap);
      for (let val of this.newActions) {
        const exist = this.NotificationCategory.find(
          (f: any) => f.id == val.categoryId
        );
        if (exist) {
          val.image = exist.image;
          val.updatedDuration = parseFloat(exist.duration);
          val.orengeLine = (val.updatedDuration * 80) / 100;
          val.redLine = (val.updatedDuration * 90) / 100;
          lastElementMap[val.categoryId] = val;
          const date1 = new Date(val.day);
          const date2 = new Date();
          date1.setHours(0, 0, 0, 0);
          date2.setHours(0, 0, 0, 0);
          const timeDefference = date1.getTime() - date2.getTime();
          const differenceInDays = Math.floor(
            timeDefference / (1000 * 60 * 60 * 24)
          );
          val.timeDefference = Math.abs(differenceInDays);
          const existingTime = val.updatedDuration - Math.abs(differenceInDays);
          val.existingTime = existingTime;
          const refDate = new Date(date1);
          refDate.setDate(refDate.getDate() + val.updatedDuration);
          const date = new Date(refDate);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const dateStringWithoutTime = `${day}-${
            month < 10 ? "0" : ""
          }${month}-${day < 10 ? "0" : ""}${year}`;
          val.nextDate = dateStringWithoutTime;
          val.total = val.expense * val.timeDefference;
          val.regularExpenseTotal = val.timeDefference * val.rgExpense;
          if (
            val.timeDefference >= val.orengeLine &&
            val.timeDefference < val.redLine
          ) {
            const message = `${val.name} is almost time over it is orenge alert please do it as soon as possible you have ${existingTime} days`;
            // this.sendSms(message);
            this.sendEmail(message);
          }
          if (val.timeDefference >= val.redLine) {
            const message = `it is red alert on ${val.name} please do it as soon as possible you have ${existingTime} days`;
            // this.sendSms(message);
            this.sendEmail(message);
          }
        }
      }
      this.newActions = this.newActions.sort(
        (a: any, b: any) => a.existingTime - b.existingTime
      );
      this.getLengths();
      if (this.latestAction.length == 0) {
        this.latestAction = this.newActions;
      }
      this.getCtegories();
    });
  }

  addCategory() {
    const data = this.categoryForm.value;
    const formData = new FormData();
    const formControlNames = ["name", "userId", "duration", "type"];
    formControlNames.forEach((controlName) => {
      const controlValue = this.categoryForm.get(controlName)?.value;
      if (controlValue !== undefined) {
        formData.append(controlName, controlValue);
      }
    });

    formData.append("myFile", this.sendFile);

    this.categoriesService.addNotificationCategory(formData).subscribe(
      (data) => {
        console.log("Created successfully", data);
        this.getCtegories();
        this.closePopup();
      },
      (error) => {
        console.log("Creation failed", error);
      }
    );
  }
  red: any;
  orange: any;
  green: any;
  getLengths() {
    const answ = this.newActions.filter(
      (f: any) => f.timeDefference >= f.redLine
    );
    this.red = answ.length;
    const org = this.newActions.filter(
      (f: any) =>
        f.timeDefference >= f.orengeLine && f.timeDefference < f.redLine
    );
    this.orange = org.length;
    const gr = this.newActions.filter(
      (f: any) => f.timeDefference < f.orengeLine
    );
    this.green = gr.length;
  }
  clicked: any;
  async filterByColor(val: any) {
    if (val == "red") {
      this.clicked = "red";
      this.getActions();

      this.latestAction = this.newActions.filter(
        (f: any) => f.timeDefference >= f.redLine
      );
    } else if (val == "orange") {
      this.clicked = "orange";
      this.getActions();

      this.latestAction = this.newActions.filter(
        (f: any) =>
          f.timeDefference >= f.orengeLine && f.timeDefference < f.redLine
      );
    } else if (val == "green") {
      this.clicked = "green";
      this.getActions();

      this.latestAction = this.newActions.filter(
        (f: any) => f.timeDefference < f.orengeLine
      );
    } else {
      this.clicked = "white";
      this.latestAction = this.newActions;
    }
  }

  getCtegories() {
    this.categoriesService.getNotificationCategory().subscribe((data: any) => {
      this.NotificationCategory = data.filter(
        (f: any) => f.userId == this.userId
      );
      for (var val of this.NotificationCategory) {
        for (let value of this.newActions) {
          if (val.id == value.categoryId) {
            val.existingTime = value.existingTime;
          }
        }
      }
      this.NotificationCategory = this.NotificationCategory.sort(
        (a: any, b: any) => a.existingTime - b.existingTime
      );

      console.log(
        "this.newActions",
        this.newActions,
        this.NotificationCategory
      );
    });
  }
  open = true;

  openPopup() {
    this.open = false;
  }
  closePopup() {
    this.open = true;
    this.categoryForm.reset();
    this.file = "";
  }

  navigateToAddPage(id: any) {
    this.router.navigate([`action/${id}`]);
  }
}
