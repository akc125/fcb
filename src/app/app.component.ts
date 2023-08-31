import { CategoriesService } from "src/services/categories.service";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  ngOnInit(): void {
    this.getUsers();
  }
  constructor(
    private router: Router,
    private categoriesService: CategoriesService
  ) {}
  currentDate = new Date();
  date = this.currentDate.toISOString().substring(8, 10);
  month = this.currentDate.toLocaleString("en-US", { month: "long" });
  title = "fcb-project";
  profileOpen: any = false;
  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
    localStorage.removeItem("userId");
    this.profileOpen=false
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
}
