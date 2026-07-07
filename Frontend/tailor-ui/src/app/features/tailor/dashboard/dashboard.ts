import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { OrderService } from '../../../services/order';

const NEXT_STATUS: Record<string, string> = {
  'Confirmed': 'In Progress',
  'In Progress': 'Ready',
  'Ready': 'Delivered',
};

@Component({
  selector: 'app-tailor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class TailorDashboard implements OnInit {

  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  user = this.authService.getCurrentUser();

  quoteRequests = signal<any[]>([]);
  quotingOrderId = signal<string | null>(null);
  quoteInput = signal<number | null>(null);
  submittingQuote = signal(false);

  orders = signal<any[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  updatingOrderId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadQuoteRequests();
    this.loadOrders();
  }

  loadQuoteRequests() {
    const tailor = this.authService.getCurrentUser();
    if (!tailor) return;

    this.orderService.getQuoteRequestsForTailor(tailor.id).subscribe({
      next: (res) => this.quoteRequests.set(res),
      error: (err) => console.error(err),
    });
  }

  startQuoting(orderId: string) {
    this.quotingOrderId.set(orderId);
    this.quoteInput.set(null);
  }

  cancelQuoting() {
    this.quotingOrderId.set(null);
  }

  submitQuote(orderId: string) {
    const tailor = this.authService.getCurrentUser();
    const quote = this.quoteInput();
    if (!tailor || quote == null || quote <= 0) return;

    this.submittingQuote.set(true);

    this.orderService.submitTailorQuote(orderId, tailor.id, quote).subscribe({
      next: () => {
        this.submittingQuote.set(false);
        this.quotingOrderId.set(null);
        this.loadQuoteRequests(); // remove it from the list once submitted
      },
      error: (err) => {
        console.error(err);
        this.submittingQuote.set(false);
      },
    });
  }

  loadOrders() {
    const tailor = this.authService.getCurrentUser();
    if (!tailor) {
      this.errorMessage.set('Please log in to view your orders.');
      this.loading.set(false);
      return;
    }

    this.orderService.getOrdersForTailor(tailor.id).subscribe({
      next: (res) => {
        this.orders.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Could not load your orders.');
        this.loading.set(false);
      },
    });
  }

  nextStatusFor(current: string): string | null {
    return NEXT_STATUS[current] ?? null;
  }

  advanceStatus(order: any) {
    const next = this.nextStatusFor(order.status);
    const tailor = this.authService.getCurrentUser();
    if (!next || !tailor) return;

    this.updatingOrderId.set(order._id);

    this.orderService.updateOrderStatus(order._id, { status: next }).subscribe({
      next: () => {
        this.updatingOrderId.set(null);
        this.loadOrders(); // refresh so the new status reflects immediately
      },
      error: (err) => {
        console.error(err);
        this.updatingOrderId.set(null);
      },
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Confirmed': return 'status-pending';
      case 'In Progress': return 'status-active';
      case 'Ready': return 'status-ready';
      case 'Delivered': return 'status-done';
      default: return 'status-pending';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}