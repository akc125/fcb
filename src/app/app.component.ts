import { CategoriesService } from "src/services/categories.service";
import { Router } from "@angular/router";
import { Component, Renderer2, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  ngOnInit(): void {
    this.getTimes();
    this.getExpenses();
    this.getUsers();
    if (this.toggleButton && this.menu) {
      this.renderer.listen("window", "click", (e: Event) => {
        if (
          e.target !== this.toggleButton.nativeElement &&
          e.target !== this.menu.nativeElement
        ) {
          this.showNotifications = false;
        }
      });
    }
  }
  // int = setInterval(() => {
  //   this.getTimes();
  //   this.getExpenses();
  //   this.getUsers();
  //   console.log("setint");
  // }, 1000);
  @ViewChild("toggleButton") toggleButton!: ElementRef;
  @ViewChild("menu") menu!: ElementRef;
  selcetion: string = "";
  dropdownOpen: boolean = false;
  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private renderer: Renderer2
  ) {}

  expense: any = [];
  lastExpenses: any = [];
  addTime() {
    const times = new Date();
    this.categoriesService.addNotificationTime(times).subscribe((data) => {
      this.getTimes();
    });
  }
  showNotifications = false;
  showNotification() {
    if (this.showNotifications) {
      this.showNotifications = false;
      this.getExpenses();
    } else {
      this.showNotifications = true;
      this.addTime();
    }
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Handle selection
  selects(value: string) {
    this.selcetion = value;
    this.dropdownOpen = false; // Close dropdown on selection
  }

  times: any = [];
  lastUpdatedTime: any;
  getTimes() {
    const id = localStorage.getItem("userId");
    this.categoriesService.getTimes().subscribe((data: any) => {
      this.times = data.filter((f: any) => f.userId == id);
      this.lastUpdatedTime = this.times[this.times.length - 1];
      console.log("times", this.lastUpdatedTime);
    });
  }
  getExpenses() {
    const id = localStorage.getItem("userId");

    this.categoriesService.getExpensList().subscribe((data) => {
      try {
        this.expense = JSON.parse(JSON.stringify(data)).filter((f: any) => {
          return f.userId == id;
        });

        const latest = new Date(this.lastUpdatedTime.times);

        this.lastExpenses = this.expense.filter((f: any) => {
          const expTimes = new Date(f.times);
          return expTimes > latest;
        });
        for (let val of this.expense) {
          const exist = this.lastExpenses.find((f: any) => f.id == val.id);
          if (exist) {
            val.position = "new";
          }
        }
        this.expense = this.expense
          .slice(
            this.lastExpenses.length < 10 ? -10 : -this.lastExpenses.length
          )
          .reverse();
      } catch (error) {
        console.error("Error processing data:", error);
      }
    });
  }

  currentDate = new Date();
  date = this.currentDate.toISOString().substring(8, 10);
  month = this.currentDate.toLocaleString("en-US", { month: "long" });
  title = "fcb-project";
  profileOpen: any = false;
  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
    localStorage.removeItem("userId");
    this.profileOpen = false;
  }
  users: any = [];
  getUsers() {
    const userId = localStorage.getItem("userId");
    this.categoriesService.getUsers().subscribe((data: any) => {
      this.users = data.filter((f: any) => f.id == userId);
    });
    console.log("usersssss", this.users);
  }

  openProfile() {
    if (this.profileOpen) {
      this.profileOpen = false;
    } else {
      this.profileOpen = true;
    }
  }
  file: any;
  onselect(event: any) {
    this.file = event.target.files[0];
  }
  userId = localStorage.getItem("userId");
  upload() {
    const formData = new FormData();
    formData.append("myFile", this.file);
    if (this.userId !== null) {
      formData.append("id", this.userId);
      this.categoriesService.editUploadedFile(formData).subscribe(
        (res) => {
          console.log("response", res);
          this.getUsers();
        },
        (err) => {
          console.log("error", err);
        }
      );
    } else {
      console.log("User ID is null");
    }
  }

  select(value: any) {
    this.selcetion = value;
  }
}
