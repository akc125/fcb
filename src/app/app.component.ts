import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router) {}
  currentDate = new Date();
  date=this.currentDate.toISOString().substring(8,10)
  month = this.currentDate.toLocaleString('en-US', { month: 'long' });
  title = 'fcb-project';
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
    localStorage.removeItem('userId');
  }
}
