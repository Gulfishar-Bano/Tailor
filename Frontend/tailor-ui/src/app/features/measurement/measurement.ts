// src/app/features/measurement/measurement.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { MeasurementService } from '../../services/measurement';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './measurement.html',
  styleUrl: './measurement.scss',
})
export class Measurements implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private measurementService = inject(MeasurementService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  errorMessage = signal('');

  returnTo: string | null = null;

  measurementForm = this.fb.group({
    chest: [null as number | null, [Validators.min(1)]],
    waist: [null as number | null, [Validators.min(1)]],
    hip: [null as number | null, [Validators.min(1)]],
    shoulder: [null as number | null, [Validators.min(1)]],
    length: [null as number | null, [Validators.min(1)]],
    sleeveLength: [null as number | null, [Validators.min(1)]],
    neck: [null as number | null, [Validators.min(1)]],
    inseam: [null as number | null, [Validators.min(1)]],
    notes: [''],
  });

  ngOnInit(): void {
    this.returnTo = this.route.snapshot.queryParamMap.get('returnTo');
    this.loadExisting();
  }

  private loadExisting(): void {
    const customerId = this.authService.getCurrentUser()?.id;
    if (!customerId) {
      this.loading.set(false);
      return;
    }

    this.measurementService.getByCustomer(customerId).subscribe({
      next: (data) => {
        if (data) {
          this.measurementForm.patchValue(data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSubmit(): void {
    if (this.measurementForm.invalid) {
      this.measurementForm.markAllAsTouched();
      return;
    }

    const customerId = this.authService.getCurrentUser()?.id;
    if (!customerId) {
      this.errorMessage.set('You must be logged in to save measurements.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    this.measurementService.save({
      customerId,
      ...this.measurementForm.value,
    } as any).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);

        setTimeout(() => {
          if (this.returnTo) {
            this.router.navigateByUrl(this.returnTo!);
          }
        }, 1200);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to save measurements.');
      },
    });
  }
}