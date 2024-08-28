import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onLogin() {
    const { email, password } = this.loginFormGroup.value;
    console.log('email2', email, password);

    try {
      // Await the login method which returns UserCredential
      const userCredential = await this.authService.login(email as string, password as string);
      
      // Get the user from the credential
      const user = userCredential.user;

      if (user) {
        // Retrieve the token from Firebase
        const token = await user.getIdToken();
        
        // Store token and user ID in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.uid);
        
        console.log('User data:', user);
        console.log('Token:', token);
        
        // Navigate to the home page
        this.router.navigate(['home']);
      }
    } catch (error) {
      alert('Invalid login credentials');
      console.error('Login error:', error);
    }
  }

  registerNavigate() {
    this.router.navigate(['register']);
  }
}
