import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryFireService } from 'src/services/category-fire.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css'],
})
export class DiaryComponent {
  ngOnInit(): void {
    this.getDiary();
  }
  constructor(
    private categoriesServiceFire: CategoryFireService,
    private router: Router
  ) {}

  open: any = false;
  diaryForm = new FormGroup({
    date: new FormControl(),
    text: new FormControl(),
  });
  diarydate = new FormControl('');
  setOpen() {
    if (this.open == false) {
      this.open = true;
    } else {
      this.open = false;
    }
  }
  diary: any;
  userId = localStorage.getItem('userId');
  getDiary() {
    this.categoriesServiceFire.getDiary().subscribe((data) => {
      const diaryData = data
        .filter((p: any) => p.userId == this.userId)
        .map((item: any) => {
          const dateObj = new Date(item.date);
          const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };

          return {
            ...item,
            dayName: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
            monthName: dateObj.toLocaleDateString('en-US', { month: 'long' }),
            year: dateObj.getFullYear(),
            date: dateObj.getDate(),
          };
        });
        this.diary = diaryData.filter((p: any) => p.date == this.diarydate.value);
        console.log('diarydate', this.diarydate.value,this.diary,data);
      
    });
  }

  saveDiary() {
    const val = this.diaryForm.value;
    this.categoriesServiceFire.addDiary(val).then((data) => {
      this.setOpen();
    });
  }
}
