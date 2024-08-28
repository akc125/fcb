import { CategoriesService } from './../../services/categories.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryFireService } from 'src/services/category-fire.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { serverTimestamp } from 'firebase/firestore';
@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
})
export class ActionComponent {
  ngOnInit(): void {
    this.category();
    this.getActions();
  }
  constructor(
    private route: ActivatedRoute,
    private CategoriesService: CategoriesService,
    private categoriesServiceFire: CategoryFireService,
    private router: Router
  ) {}
  id: any = this.route.snapshot.paramMap.get('id');
  userId = localStorage.getItem('userId');
  data: any = {};
  name: any = '';
  duration!: any;
  imageUrl!: any;
  type!: any;
  defaultDate: any;
  actionsDataForm = new FormGroup({
    name: new FormControl(),
    categoryId: new FormControl(),
    expense: new FormControl(),
    rgExpense: new FormControl(),
    action: new FormControl(),
    day: new FormControl(),
    duration: new FormControl(),
    userId: new FormControl(this.userId),
    description: new FormControl(),
  });

  category() {
    const currentDate = new Date();
    this.defaultDate = currentDate.toISOString().substring(0, 10);
    this.categoriesServiceFire
      .getNotificationCategoryById(this.id)
      .subscribe((data: any) => {
        console.log('Fetched Data:', data);
        this.data = data;
        this.name = data.name;
        this.duration = data.duration;
        this.imageUrl = data.imageUrl;
        this.type = data.type;
      });
  }

  addActions() {
    const formData = {
      ...this.actionsDataForm.value,
      userId: this.userId,
      name: this.name,
      duration: this.duration,
      imageUrl: this.imageUrl,
      categoryId: this.id,
      createdAt: serverTimestamp(),
    };
    formData.rgExpense = Number(formData.rgExpense);
    this.categoriesServiceFire
      .addNotificationnotificationExpenseAndAction(formData)
      .then((data) => {
        this.actionsDataForm.reset();
      });
  }
  categoryUpdateForm = new FormGroup({
    name: new FormControl(this.name),
    duration: new FormControl(this.duration),
    type: new FormControl(this.type),
  });
  file: any;
  sendFile: any;

  image: any;
  setimageURL: any;
  onSelect = (e: any) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      this.image = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setimageURL = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };
  async updateCategory() {
    const storage = getStorage();
    try {
      if (this.file) {
        const imageRef = ref(storage, `images/${this.file.name}`);
        const snapshot = await uploadBytes(imageRef, this.file);
        this.setimageURL = await getDownloadURL(snapshot.ref);
      }
      const newFormData = {
        ...this.categoryUpdateForm.value,
        id: this.id,
        imageUrl: this.setimageURL ? this.setimageURL : this.imageUrl,
      };
      this.categoriesServiceFire
        .updateNotificationCategory(newFormData)
        .then((data) => {
          this.category();
        });
    } catch (error) {
      console.error('Error saving credit:', error);
      alert('An error occurred while saving the credit. Please try again.');
    }
  }
  open = true;
  openPopup() {
    this.open = false;
  }
  closePopup() {
    this.open = true;
    this.categoryUpdateForm.reset();
    this.file = '';
  }
  deleteCategory() {
    this.CategoriesService.deleteNotificationCategory(this.id).subscribe(
      (data) => {
        this.category();
        this.router.navigate(['notification']);
      }
    );
    this.CategoriesService.deleteNotificationCategoryAndActions(
      this.id
    ).subscribe((data) => {});
  }
  return() {
    this.router.navigate(['notification']);
  }
  actions: any[] = [];
  getActions() {
    this.categoriesServiceFire
      .getNotificationAndAction()
      .subscribe((data: any) => {
        this.actions = data.filter(
          (f: any) => f.userId == this.userId && f.categoryId == this.id
        );
        this.actions.reverse();
      });
  }
}
