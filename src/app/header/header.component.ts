import { CategoriesService } from "src/services/categories.service";
import { Router } from "@angular/router";
import { Component, Renderer2, ElementRef, ViewChild } from "@angular/core";
import { CategoryFireService } from "src/services/category-fire.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
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
  @ViewChild("toggleButton") toggleButton!: ElementRef;
  @ViewChild("menu") menu!: ElementRef;

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private categoriesServiceFire: CategoryFireService,
    private renderer: Renderer2
  ) {}

  expense: any = [];
  lastExpenses: any = [];
  addTime() {
    const times = new Date();
    this.categoriesServiceFire.addNotificationTime(times).then((data) => {
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
  times: any = [];
  lastUpdatedTime: any;
  showOff:any
  getTimes() {
    const id = localStorage.getItem("userId");
    this.categoriesServiceFire.getTimes().subscribe((data: any) => {
      this.times = data.filter((f: any) => f.userId == id);
      this.lastUpdatedTime = this.times[this.times.length - 1];
      console.log("times", this.lastUpdatedTime);
    });
  }
  getExpenses() {
    const id = localStorage.getItem("userId");

    this.categoriesServiceFire.getExpensList().subscribe((data) => {
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
        console.log("expensesssssss", this.expense.slice(-10));
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
        (res:any) => {
          console.log("response", res);
          this.getUsers();
        },
        (err:any) => {
          console.log("error", err);
        }
      );
    } else {
      console.log("User ID is null");
    }
  }
}
