import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCustomersService, AdminCustomer } from '../admin-customers/admin-customers'; // adjust path
import { OrderService } from '../../../services/order';
import { AdminNavbar } from '../../admin-navbar/admin-navbar'; // adjust path

@Component({
  selector: 'app-admin-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbar],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class AdminCustomerList implements OnInit {
  private customersService = inject(AdminCustomersService);
  private orderService = inject(OrderService);

  customers = signal<AdminCustomer[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  searchTerm = '';
  page = 1;
  limit = 20;
  total = signal(0);
  totalPages = signal(1);

  // --- Detail modal ---
  activeCustomer = signal<AdminCustomer | null>(null);
  customerOrders = signal<any[]>([]);
  loadingOrders = signal(false);

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.loading.set(true);
    this.customersService.getCustomers({
      search: this.searchTerm || undefined,
      page: this.page,
      limit: this.limit,
    }).subscribe({
      next: (res) => {
        this.customers.set(res.customers);
        this.total.set(res.total);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage.set('Could not load customers.');
        this.loading.set(false);
      },
    });
  }

  onSearchChange(): void {
    this.page = 1;
    this.fetchCustomers();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page = p;
    this.fetchCustomers();
  }

  openDetail(customer: AdminCustomer): void {
    this.activeCustomer.set(customer);
    this.loadingOrders.set(true);
    this.customerOrders.set([]);

    this.orderService.getMyOrders(customer._id).subscribe({
      next: (orders) => {
        this.customerOrders.set(orders);
        this.loadingOrders.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.loadingOrders.set(false);
      },
    });
  }

  closeDetail(): void {
    this.activeCustomer.set(null);
  }

  statusClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('pending') || s.includes('awaiting')) return 'status-pending';
    if (s.includes('progress') || s.includes('confirmed')) return 'status-active';
    if (s.includes('completed') || s.includes('delivered') || s.includes('ready')) return 'status-done';
    if (s.includes('cancelled') || s.includes('rejected')) return 'status-cancelled';
    return '';
  }
}