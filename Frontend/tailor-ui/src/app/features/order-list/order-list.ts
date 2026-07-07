import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order';
import { AuthService } from '../../services/auth';
import { Navbar } from '../navbar/navbar'; // adjust path to match your project

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss',
})
export class OrderList implements OnInit {

  private orderService = inject(OrderService);
  private authService = inject(AuthService);

  orders = signal<any[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const customer = this.authService.getCurrentUser();

    if (!customer) {
      this.errorMessage.set('Please log in to view your orders.');
      this.loading.set(false);
      return;
    }

    this.orderService.getMyOrders(customer.id).subscribe({
      next: (res) => {
        this.orders.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Could not load your orders. Please try again.');
        this.loading.set(false);
      },
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Accepted':
      case 'In Progress': return 'status-active';
      case 'Delivered':
      case 'Completed': return 'status-done';
      default: return 'status-pending';
    }
  }
}