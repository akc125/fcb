import { CategoriesService } from "./../../services/categories.service";
import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-action",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.css"],
})
export class ActionComponent {
  ngOnInit(): void {
    this.category();
    this.getActions();
  }
  constructor(
    private route: ActivatedRoute,
    private CategoriesService: CategoriesService,
    private router: Router
  ) {}
  id: any = this.route.snapshot.paramMap.get("id");
  userId = localStorage.getItem("userId");
  data: any = [];
  name!: any;
  duration!: any;
  actionsDataForm: any;
  defaultDate: any;
  category() {
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
    this.CategoriesService.getNotificationCategoryById(this.id).subscribe(
      (data: any) => {
        this.data = data;
        this.name = data.map((p: any) => p.name);
        this.duration = data.map((p: any) => p.duration);
        this.categoryUpdateForm.patchValue({
          name: data[0].name,
          duration: data[0].duration,
          type: data[0].type,
        });
        this.actionsDataForm = new FormGroup({
          name: new FormControl(this.name),
          categoryId: new FormControl(this.id),
          expense: new FormControl(),
          rgExpense: new FormControl(),
          action: new FormControl(),
          day: new FormControl(),
          duration: new FormControl(this.duration),
          userId: new FormControl(this.userId),
          description: new FormControl(),
        });
      }
    );
  }

  addActions() {
    const formData = this.actionsDataForm.value;
    console.log('timeDefference',this.actionsDataForm.get('rgExpense').value)
    formData.rgExpense = Number(formData.rgExpense);
    this.CategoriesService.addNotificationnotificationExpenseAndAction(
      formData
    ).subscribe((data) => {
      this.actionsDataForm.reset();
    });
  }
  categoryUpdateForm = new FormGroup({
    name: new FormControl(),
    duration: new FormControl(),
    type: new FormControl(),
  });
  file: any;
  sendFile: any;
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
  updateCategory() {
    const formDta = new FormData();
    formDta.append("name", this.categoryUpdateForm.get("name")?.value);
    formDta.append("type", this.categoryUpdateForm.get("type")?.value);
    formDta.append("myFile", this.sendFile);
    formDta.append("duration", this.categoryUpdateForm.get("duration")?.value);
    this.CategoriesService.updateNotificationCategory(
      formDta,
      this.id
    ).subscribe((data) => {
      this.category();
    });
  }
  open = true;
  openPopup() {
    this.open = false;
  }
  closePopup() {
    this.open = true;
    this.categoryUpdateForm.reset();
    this.file = "";
  }
  deleteCategory() {
    this.CategoriesService.deleteNotificationCategory(this.id).subscribe(
      (data) => {
        this.category();
        this.router.navigate(["notification"]);
      }
    );
    this.CategoriesService.deleteNotificationCategoryAndActions(
      this.id
    ).subscribe((data) => {});
  }
  return() {
    this.router.navigate(["notification"]);
  }
  actions: any[] = [];
  getActions() {
    this.CategoriesService.getNotificationAndAction().subscribe((data: any) => {
      this.actions = data.filter(
        (f: any) => f.userId == this.userId && f.categoryId == this.id
      );
      this.actions.reverse();
    });
  }
}
