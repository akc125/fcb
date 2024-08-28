import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/services/categories.service';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css'],
})
export class ExpenseDetailsComponent {
  desc = new FormControl();
  id: any = this.route.snapshot.paramMap.get('id');
  descriptions: any = [];

  constructor(
    private route: ActivatedRoute,
    private categoriesServiceFire: CategoryFireService
  ) {}

  ngOnInit(): void {
    this.getDescriptions();
  }

  addData() {
    const defaultDate = new Date();
    const currentDate = defaultDate.toISOString().substring(0, 10);
    const data = {
      desc: this.desc.value,
      date: currentDate,
      descId: this.id,
    };
    this.categoriesServiceFire.postDesciption(data).then(() => {
      this.getDescriptions();
    });
  }

  getDescriptions() {
    const id = localStorage.getItem('userId');
    this.categoriesServiceFire.getDescription().subscribe((data) => {
      this.descriptions = data;
      this.descriptions = this.descriptions.filter(
        (f: any) => f.descId == this.id && f.userId == id
      );
      console.log('descriptions',this.descriptions)
      this.desc.setValue('');
    });
  }
}
