import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryFireService } from 'src/services/category-fire.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css'],
})
export class CommissionComponent {
  ngOnInit(): void {
    this.getCommission();
  }
  constructor(
    private categoriesServiceFire: CategoryFireService,
    private router: Router
  ) {}
  userId = localStorage.getItem('userId');
  status = false;
  open() {
    this.status = true;
  }
  close() {
    this.status = false;
  }
  file: any;
  handleFile(event: any) {
    this.file = event.target.files[0];
  }
  commissionGroup = new FormGroup({
    userId: new FormControl(this.userId),
    name: new FormControl(),
    description: new FormControl(),
    active: new FormControl(true),
    day: new FormControl(),
    amount: new FormControl(),
    guarantee: new FormControl(),
  });
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
  async addCommissions() {
    const storage = getStorage();
    try {
      if (this.image) {
        const imageRef = ref(storage, `images/${this.image.name}`);
        const snapshot = await uploadBytes(imageRef, this.image);
        this.setimageURL = await getDownloadURL(snapshot.ref);
      }
      const formData = {
        ...this.commissionGroup?.value,
        imageUrl: this.setimageURL,
      };
      this.categoriesServiceFire.addCommission(formData).then((data) => {
        this.getCommission();
      });
    } catch (error) {
      console.error('Error saving credit:', error);
      alert('An error occurred while saving the credit. Please try again.');
    }
  }
  commission: any = [];
  chartOptions: any = [];
  getCommission() {
    this.categoriesServiceFire.getCommissions().subscribe((data: any) => {
      this.commission = data.filter(
        (f: any) => f.userId == this.userId && f.active == true
      );
      const today = new Date();
      for (let val of this.commission) {
        const day = val.day;
        const date1 = new Date(day);
        const deff = date1.getTime() - today.getTime();
        const differenceInDays = Math.floor(deff / (1000 * 60 * 60 * 24));
        val.deff = Math.abs(differenceInDays);
        val.expTime = Math.floor(
          (Number(val.deff) * 100) / Number(val.guarantee)
        );
        val.gTime = 100 - val.expTime;
        if (val.gTime <= 0) {
          val.gTime = 0;
        }
        const age = this.convertDaysToYearsMonthsDays(val.deff);
        val.age = age;
        const chartOptions = {
          animationEnabled: true,
          title: {
            text: `Guarantee: ${val.guarantee} days`,
          },
          data: [
            {
              type: 'doughnut',
              yValueFormatString: "#,###.##'%'",
              indexLabel: '{name}',
              dataPoints: [
                { y: val.gTime, name: 'Guarantee' },
                { y: val.expTime, name: 'Expaire' },
              ],
            },
          ],
        };
        this.chartOptions.push(chartOptions);
        console.log('age', differenceInDays);
      }
      console.log('data', this.commission);
    });
  }
  convertDaysToYearsMonthsDays(totalDays: number): {
    years: number;
    months: number;
    days: number;
  } {
    const years = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = totalDays % 365.25;
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const remainingDaysAfterMonths = remainingDaysAfterYears % 30.44;
    return { years, months, days: Math.round(remainingDaysAfterMonths) };
  }
  goToDetails(id: any) {
    this.router.navigate([`commissionDetails/${id}`]);
  }
  goToDeCommissionPage() {
    this.router.navigate([`decommission`]);
  }
}
