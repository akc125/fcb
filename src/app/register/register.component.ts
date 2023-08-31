import { CategoriesService } from "src/services/categories.service";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  ngOnInit(): void {}
  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private http: HttpClient
  ) {}
  registerFormGroupe = new FormGroup({
    name: new FormControl(),
    password: new FormControl(),
  });
  
  fileName = "";
  file: any = null;

  selectImage(event: any) {
    this.file = event.target.files[0];
    console.log("this.file ", this.file);
  }

  upload() {
    const formData = new FormData();
    formData.append("myFile", this.file);
    formData.append("name", this.registerFormGroupe.value.name);
    formData.append("password", this.registerFormGroupe.value.password);
  
    this.categoriesService.uploadfile(formData).subscribe(
      (res) => {
        console.log("response", res);
        this.router.navigate(["login"]);
      },
      (err) => {
        console.log("error", err);
      }
    );
  }
  
}
