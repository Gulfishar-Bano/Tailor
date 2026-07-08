import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';

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

  submitDoorstepRequest(): void {
    if (this.doorstepForm.invalid) {
      this.doorstepForm.markAllAsTouched();
      return;
    }

    // TODO: wire to a real endpoint, e.g.
    // this.doorstepService.requestPickup(this.doorstepForm.value).subscribe(...)
    console.log('Doorstep request:', this.doorstepForm.value);

    this.step.set('confirmed');
  }

  proceedToTailors(): void {
    this.close();
    this.router.navigate(['/customer/tailors']);
  }

  close(): void {
    this.closed.emit();
  }
}