import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  registerForm = this.fb.group({
    name: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    phone: ['', Validators.required],

    password: ['', [Validators.required, Validators.minLength(6)]],
    role:['', Validators.required],
     experience: [''],

  city: [''],

  specialization: [''],

  bio: [''],
  });

 onSubmit() {
  this.authService.register(this.registerForm.value).subscribe({
    next: (res) => {
      console.log('Success', res);

      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.log('Error', err);
    },
  });
}

}