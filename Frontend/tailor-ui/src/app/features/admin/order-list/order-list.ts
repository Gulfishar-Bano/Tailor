import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, AdminOrder } from '../../../services/order';
import { MeasurementService, MeasurementData } from '../../../services/measurement';
import { DoorstepService, DoorstepRequestData } from '../../../services/doorstep'; // ADD THIS
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
  private measurementService = inject(MeasurementService);
  private doorstepService = inject(DoorstepService); // ADD THIS

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
    'Contacted Tailor',
    'Confirmed by Tailor',
    'In Progress',
    'Ready for Fitting',
    'Completed',
    'Cancelled',
    'Rejected by Tailor',
  ];

  activeOrder = signal<AdminOrder | null>(null);
  selectedStatus = signal('');
  statusNotes = signal('');
  submitting = signal(false);

  measurementData = signal<MeasurementData | null>(null);
  loadingMeasurements = signal(false);
  measurementError = signal('');

  // --- NEW: doorstep request state ---
  doorstepData = signal<DoorstepRequestData | null>(null);
  loadingDoorstep = signal(false);

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

  customerPhone(order: AdminOrder): string {
    return typeof order.customerId === 'object' ? (order.customerId?.phone ?? '—') : '—';
  }

  tailorName(order: AdminOrder): string {
    if (!order.tailorId) return 'Unknown Tailor';
    return typeof order.tailorId === 'object' ? order.tailorId.name : order.tailorId;
  }

  tailorPhone(order: AdminOrder): string {
    return typeof order.tailorId === 'object' ? (order.tailorId?.phone ?? '—') : '—';
  }

  statusClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('pending')) return 'status-pending';
    if (s.includes('progress') || s.includes('confirmed') || s.includes('contacted')) return 'status-active';
    if (s.includes('completed') || s.includes('ready')) return 'status-done';
    if (s.includes('cancelled') || s.includes('rejected')) return 'status-cancelled';
    return '';
  }

  openOrderDetails(order: AdminOrder): void {
    this.activeOrder.set(order);
    this.selectedStatus.set(order.status);
    this.statusNotes.set(order.adminNotes ?? '');

    this.measurementData.set(null);
    this.measurementError.set('');
    this.doorstepData.set(null);

    const customerId = typeof order.customerId === 'object' && order.customerId !== null
      ? order.customerId._id
      : order.customerId;

    if (!customerId) {
      this.measurementError.set('No customer linked to this order.');
      return;
    }

    // fetch measurements
    this.loadingMeasurements.set(true);
    this.measurementService.getByCustomer(customerId).subscribe({
      next: (data) => {
        this.measurementData.set(data);
        this.loadingMeasurements.set(false);
      },
      error: (err: any) => {
        this.measurementError.set(err.error?.message ?? 'No measurements found for this customer.');
        this.loadingMeasurements.set(false);
      },
    });

    // fetch doorstep request, independently
    this.loadingDoorstep.set(true);
    this.doorstepService.getByCustomer(customerId).subscribe({
      next: (data) => {
        this.doorstepData.set(data);
        this.loadingDoorstep.set(false);
      },
      error: () => {
        this.doorstepData.set(null);
        this.loadingDoorstep.set(false);
      },
    });
  }

  closeOrderDetails(): void {
    this.activeOrder.set(null);
    this.measurementData.set(null);
    this.measurementError.set('');
    this.doorstepData.set(null);
  }

  submitStatusUpdate(): void {
    const order = this.activeOrder();
    const status = this.selectedStatus();
    if (!order || !status) return;

    this.submitting.set(true);

    this.orderService.updateOrderStatus(order._id, status, this.statusNotes()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.closeOrderDetails();
        this.fetchOrders();
      },
      error: (err: any) => {
        console.error(err);
        this.submitting.set(false);
      },
    });
  }
}