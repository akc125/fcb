import { CategoriesService } from 'src/services/categories.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  ngOnInit(): void {}
  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}
  loginFormGroup = new FormGroup({
    name: new FormControl(),
    password: new FormControl(),
  });
  onLigin() {
    this.categoriesService.getLogin(this.loginFormGroup.value).subscribe(
      (data: any) => {
        const userId = data.id;
        localStorage.setItem('token', data.mytoken);
        localStorage.setItem('userId', userId);
        console.log('data', data);
        this.router.navigate(['home']);
      },
      (error: any) => {
        alert('wrong entry',);
        console.log('data', error);
      }
    );
  }
}
