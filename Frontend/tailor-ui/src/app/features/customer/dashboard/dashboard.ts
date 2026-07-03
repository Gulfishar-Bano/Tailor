import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class CustomerDashboard implements OnInit {
  private authService = inject(AuthService);

  userName = 'Guest';
  userInitials = 'G';

  // TODO: replace with real values from your order/measurement services
  activeOrders = 2;
  savedMeasurements = 3;
  favoriteTailors = 5;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    console.log('Current User:', user);
    this.userName = user?.name ?? 'Guest';
    this.userInitials = this.getInitials(this.userName);
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}