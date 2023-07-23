import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService } from 'src/services/categories.service';

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
    private categoriesService: CategoriesService
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
    this.categoriesService.postDesciption(data).subscribe(() => {
      this.getDescriptions();
    });
  }

  getDescriptions() {
    const id = localStorage.getItem('userId');
    this.categoriesService.getDescription().subscribe((data) => {
      this.descriptions = data;
      this.descriptions = this.descriptions.filter(
        (f: any) => f.descId == this.id && f.userId == id
      );
      this.desc.setValue('');
    });
  }
}
