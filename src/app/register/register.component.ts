import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  ngOnInit(): void {}
  constructor(private categoriesService: CategoriesService,private router:Router) {}
  registerFormGroupe = new FormGroup({
    name: new FormControl(),
    password: new FormControl(),
  });
  register() {
    this.categoriesService
      .registerUser(this.registerFormGroupe.value)
      .subscribe((data) => {
        this.router.navigate(['login'])
      });
  }
}
