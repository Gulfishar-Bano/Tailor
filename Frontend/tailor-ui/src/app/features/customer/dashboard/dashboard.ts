import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { Navbar } from '../../navbar/navbar';
import { MeasurementChoiceModal } from '../../measurement-choice-modal/measurement-choice-modal';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [RouterLink, Navbar, MeasurementChoiceModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class CustomerDashboard implements OnInit {
  private authService = inject(AuthService);

  userName = 'Guest';
  userInitials = 'G';

  activeOrders = 2;
  savedMeasurements = 3;
  favoriteTailors = 5;

  showMeasurementModal = signal(false);

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name ?? 'Guest';
    this.userInitials = this.getInitials(this.userName);
  }

  openFindTailorFlow(): void {
    this.showMeasurementModal.set(true);
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