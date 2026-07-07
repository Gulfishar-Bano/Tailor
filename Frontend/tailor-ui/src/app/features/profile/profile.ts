import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class CustomerProfile {
  private authService = inject(AuthService);

  user = this.authService.getCurrentUser();
}