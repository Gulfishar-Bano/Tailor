import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
    next: (res: any) => {
  console.log('Login Success', res);

  if (res.user.role === 'customer') {
    this.router.navigate(['/customer/dashboard']);
  } else if (res.user.role === 'tailor') {
    this.router.navigate(['/tailor/dashboard']);
  } else if (res.user.role === 'admin') {
    this.router.navigate(['/admin/dashboard']);
  }
},

      error: (err) => {
        console.log('Login Failed', err);
      },
    });
  }
}