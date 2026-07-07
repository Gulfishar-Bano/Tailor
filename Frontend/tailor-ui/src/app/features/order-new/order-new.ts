import { Component, OnInit, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { Navbar } from '../navbar/navbar'; // adjust path to match your project

@Component({
  selector: 'app-order-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './order-new.html',
  styleUrl: './order-new.scss',
})
export class OrderNew implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  tailorId = signal<string | null>(null);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  orderPlaced = signal(false); // drives the success popup

  garmentTypes = [
    'Blouse', 'Kurti', 'Salwar Suit', 'Lehenga', 'Bridal Wear',
    "Men's Shirt", "Men's Pant", 'Coat & Suit', 'Kids Wear', 'Alteration', 'All Types',
  ];
  stitchingTypes = ['New Stitching', 'Alteration', 'Repair'];
  fitOptions = ['Slim Fit', 'Regular Fit', 'Loose Fit'];

  // orderForm = this.fb.group({
  //   garmentType: ['', Validators.required],
  //   stitchingType: ['', Validators.required],
  //   style: ['', Validators.required],
  //   expectedDelivery: ['', Validators.required],

  //   occasion: [''],
  //   neckDesign: [''],
  //   sleeveType: [''],
  //   fit: [''],
  //   fabric: [''],
  //   fabricColor: [''],
  //   embroidery: [false],
  //   description: [''],
  // });

orderForm = this.fb.group({
  garmentType: ['', Validators.required],
  stitchingType: ['', Validators.required],
  style: ['', Validators.required],
  expectedDelivery: ['', Validators.required],
  budgetMin: [500, [Validators.required, Validators.min(1)]],
  budgetMax: [2000, [Validators.required, Validators.min(1)]],
  occasion: [''],
  neckDesign: [''],
  sleeveType: [''],
  fit: [''],
  fabric: [''],
  fabricColor: [''],
  embroidery: [false],
  description: [''],
}, { validators: this.budgetRangeValidator });

budgetRangeValidator(group: AbstractControl): ValidationErrors | null {
  const min = group.get('budgetMin')?.value;
  const max = group.get('budgetMax')?.value;
  if (min != null && max != null && Number(max) < Number(min)) {
    return { budgetRangeInvalid: true };
  }
  return null;
}
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.tailorId.set(params.get('tailorId'));
    });
  }

  onSubmit() {
    const customer = this.authService.getCurrentUser();

    if (this.orderForm.invalid || !this.tailorId() || !customer) {
      this.orderForm.markAllAsTouched();
      if (!customer) {
        this.errorMessage.set('You need to be logged in to place an order.');
      }
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      customerId: customer.id,
      tailorId: this.tailorId(),
      ...this.orderForm.value,
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.orderPlaced.set(true); // show success popup, don't navigate yet
      },
      error: (err) => {
        console.error(err);
        this.submitting.set(false);
        this.errorMessage.set('Something went wrong placing your order. Please try again.');
      },
    });
  }

  goToOrders() {
    this.router.navigate(['/customer/orders']);
  }

  browseMoreTailors() {
    this.router.navigate(['/customer/tailors']);
  }
}