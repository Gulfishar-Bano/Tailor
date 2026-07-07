// src/app/features/admin/order-list/order-list.ts
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, AdminOrder } from '../../../services/order';
import { AdminNavbar } from '../../admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbar],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class AdminOrderList implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<AdminOrder[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  statusFilter = '';
  searchTerm = '';
  page = 1;
  limit = 20;
  totalPages = signal(1);
  total = signal(0);

  statusOptions = [
    'Pending Admin Review',
    'Confirmed',
    'In Progress',
    'Ready for Fitting',
    'Completed',
    'Cancelled',
  ];

  // --- Assign Price / margin modal state (now only for Tailor Quoted orders) ---
  marginOrder = signal<AdminOrder | null>(null);
  adminMargin = signal<number | null>(null);
  adminNotes = signal('');
  submitting = signal(false);
  sendingToTailor = signal<string | null>(null); // orderId currently being forwarded

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading.set(true);
    this.orderService
      .getAdminOrders({
        status: this.statusFilter || undefined,
        search: this.searchTerm || undefined,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (res) => {
          this.orders.set(res.orders);
          this.total.set(res.total);
          this.totalPages.set(res.totalPages);
          this.loading.set(false);
        },
        error: (err: any) => {
          this.errorMessage.set(err.error?.message ?? 'Failed to load orders.');
          this.loading.set(false);
        },
      });
  }

  onFilterChange(): void {
    this.page = 1;
    this.fetchOrders();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page = p;
    this.fetchOrders();
  }

  customerName(order: AdminOrder): string {
    if (!order.customerId) return 'Unknown Customer';
    return typeof order.customerId === 'object' ? order.customerId.name : order.customerId;
  }

  tailorName(order: AdminOrder): string {
    if (!order.tailorId) return 'Unknown Tailor';
    return typeof order.tailorId === 'object'
      ? (order.tailorId.shopName || order.tailorId.name)
      : order.tailorId;
  }

  statusClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('pending')) return 'status-pending';
    if (s.includes('progress') || s.includes('confirmed')) return 'status-active';
    if (s.includes('completed')) return 'status-done';
    if (s.includes('cancelled')) return 'status-cancelled';
    return '';
  }

  // ------------------------------------------------------------------
  // Step 1: send to tailor for their own quote
  // ------------------------------------------------------------------

  sendToTailor(order: AdminOrder): void {
    this.sendingToTailor.set(order._id);
    this.orderService.forwardToTailor(order._id).subscribe({
      next: () => {
        this.sendingToTailor.set(null);
        this.fetchOrders();
      },
      error: (err: any) => {
        console.error(err);
        this.sendingToTailor.set(null);
      },
    });
  }

  // ------------------------------------------------------------------
  // Step 2: add margin once tailor has responded (Tailor Quoted status)
  // ------------------------------------------------------------------

  openMarginModal(order: AdminOrder): void {
    this.marginOrder.set(order);
    this.adminMargin.set(null);
    this.adminNotes.set('');
  }

  closeMarginModal(): void {
    this.marginOrder.set(null);
  }

  get computedFinalPrice(): number | null {
    const order = this.marginOrder();
    const margin = this.adminMargin();
    if (!order?.tailorQuote || margin == null) return null;
    return order.tailorQuote + margin;
  }

  submitMargin(): void {
    const order = this.marginOrder();
    const margin = this.adminMargin();
    if (!order || margin == null || margin <= 0) return;

    this.submitting.set(true);

    this.orderService.addMargin(order._id, margin, this.adminNotes()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeMarginModal();
        this.fetchOrders();
      },
      error: (err: any) => {
        console.error(err);
        this.submitting.set(false);
      },
    });
  }
}