import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';
 // measurement-choice-modal.ts
import { OrderService } from '../../services/order'; // adjust path
import { AuthService } from '../../services/auth';


type Step = 'choice' | 'doorstep-form' | 'confirmed';

@Component({
  selector: 'app-measurement-choice-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './measurement-choice-modal.html',
  styleUrl: './measurement-choice-modal.scss',
})
export class MeasurementChoiceModal {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
// inside the class
private orderService = inject(OrderService);
private authService = inject(AuthService);

  @Output() closed = new EventEmitter<void>();

  step = signal<Step>('choice');

  doorstepForm = this.fb.group({
    address: ['', Validators.required],
    preferredDate: ['', Validators.required],
    preferredTime: ['morning', Validators.required],
    notes: [''],
  });

  chooseManual(): void {
    this.close();
    this.router.navigate(['/customer/measurements'], {
      queryParams: { returnTo: '/customer/tailors' },
    });
  }

  chooseDoorstep(): void {
    this.step.set('doorstep-form');
  }

  backToChoice(): void {
    this.step.set('choice');
  }

 submitting = signal(false);
// measurement-choice-modal.ts
submitDoorstepRequest(): void {
  if (this.doorstepForm.invalid) {
    this.doorstepForm.markAllAsTouched();
    return;
  }

  const customerId = this.authService.getCurrentUser()?.id;
  if (!customerId) return;

  this.submitting.set(true);

  const formValue = this.doorstepForm.value;

  this.orderService.requestDoorstepMeasurement({
    customerId,
    address: formValue.address ?? '',
    preferredDate: formValue.preferredDate ?? '',
    preferredTime: formValue.preferredTime ?? 'morning',
    notes: formValue.notes ?? '',
  }).subscribe({
    next: () => {
      this.submitting.set(false);
      this.step.set('confirmed');
    },
    error: (err) => {
      console.error(err);
      this.submitting.set(false);
    },
  });
}

  // submitDoorstepRequest(): void {
  //   if (this.doorstepForm.invalid) {
  //     this.doorstepForm.markAllAsTouched();
  //     return;
  //   }

  //   // TODO: wire to a real endpoint, e.g.
  //   // this.doorstepService.requestPickup(this.doorstepForm.value).subscribe(...)
  //   console.log('Doorstep request:', this.doorstepForm.value);

  //   this.step.set('confirmed');
  // }

  proceedToTailors(): void {
    this.close();
    this.router.navigate(['/customer/tailors']);
  }

  close(): void {
    this.closed.emit();
  }
}