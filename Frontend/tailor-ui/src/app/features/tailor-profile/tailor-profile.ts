import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ReviewService } from '../../services/review';
import { Navbar } from '../navbar/navbar'; // adjust path to match your project

@Component({
  selector: 'app-tailor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar],
  templateUrl: './tailor-profile.html',
  styleUrl: './tailor-profile.scss',
})
export class TailorProfile implements OnInit {

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);

  tailorId = signal<string>('');
  tailor = signal<any | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  averageRating = signal(0);
  reviewCount = signal(0);
  reviews = signal<any[]>([]);
  roundedRating = computed(() => Math.round(this.averageRating()));

  // orders this customer has with this tailor that are eligible for review
  reviewableOrders = signal<any[]>([]);
  showReviewForm = signal(false);
  selectedOrderId = signal('');
  newRating = signal(5);
  newComment = signal('');
  submittingReview = signal(false);

  starRow = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('No tailor specified.');
      this.loading.set(false);
      return;
    }
    this.tailorId.set(id);
    this.loadTailor(id);
    this.loadReviews(id);
    this.loadReviewableOrders(id);
  }

  private loadTailor(id: string) {
    this.authService.getTailorById(id).subscribe({
      next: (res) => {
        this.tailor.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Could not load this tailor\'s profile.');
        this.loading.set(false);
      },
    });
  }

  private loadReviews(id: string) {
    this.reviewService.getTailorReviews(id).subscribe({
      next: (res) => {
        this.averageRating.set(res.averageRating);
        this.reviewCount.set(res.count);
        this.reviews.set(res.reviews);
      },
      error: (err) => console.error(err),
    });
  }

  private loadReviewableOrders(tailorId: string) {
    const customer = this.authService.getCurrentUser();
    if (!customer) return;

    this.authService.getMyOrders(customer.id).subscribe({
      next: (orders) => {
        const reviewedOrderIds = new Set(
          this.reviews().filter(r => r.customerId === customer.id).map(r => r.orderId)
        );
        const eligible = orders.filter(o =>
          o.tailorId === tailorId &&
          ['Delivered', 'Completed'].includes(o.status) &&
          !reviewedOrderIds.has(o._id)
        );
        this.reviewableOrders.set(eligible);
      },
      error: (err) => console.error(err),
    });
  }

  openReviewForm(orderId: string) {
    this.selectedOrderId.set(orderId);
    this.newRating.set(5);
    this.newComment.set('');
    this.showReviewForm.set(true);
  }

  closeReviewForm() {
    this.showReviewForm.set(false);
  }

  setRating(value: number) {
    this.newRating.set(value);
  }

  submitReview() {
    const customer = this.authService.getCurrentUser();
    if (!customer || !this.selectedOrderId()) return;

    this.submittingReview.set(true);

    this.reviewService.createReview({
      tailorId: this.tailorId(),
      customerId: customer.id,
      orderId: this.selectedOrderId(),
      rating: this.newRating(),
      comment: this.newComment(),
    }).subscribe({
      next: () => {
        this.submittingReview.set(false);
        this.showReviewForm.set(false);
        // refresh reviews + reviewable orders so the submitted one disappears from the list
        this.loadReviews(this.tailorId());
        this.loadReviewableOrders(this.tailorId());
      },
      error: (err) => {
        console.error(err);
        this.submittingReview.set(false);
      },
    });
  }
}