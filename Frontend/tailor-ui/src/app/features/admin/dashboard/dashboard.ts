import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

import { AdminNavbar } from '../../admin-navbar/admin-navbar'; // adjust path to match your project
// import { AdminService } from '../../../services/admin'; // wire this up to your real API

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, AdminNavbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private authService = inject(AuthService);
  // private adminService = inject(AdminService);

  userName = 'Admin';
  userInitials = 'A';

  // Replace these with real values from your admin/order/tailor services
  totalCustomers = 128;
  totalTailors = 34;
  activeOrders = 41;
  pendingApprovals = 6;
  totalRevenue = 285400;

  pendingTailorApprovals: PendingTailor[] = [
    { name: 'Meera Tailors', location: 'Bengaluru', appliedOn: '05 Jul 2026' },
    { name: 'Rajesh Stitching Co.', location: 'Chennai', appliedOn: '04 Jul 2026' },
    { name: 'Ananya Designs', location: 'Hyderabad', appliedOn: '02 Jul 2026' },
  ];

  recentOrders: RecentOrder[] = [
    { title: 'Bridal Lehenga — Meera Tailors', customer: 'Priya Sharma', date: '28 Jun 2026', status: 'active' },
    { title: "Men's Formal Shirt — Rajesh Stitching Co.", customer: 'Arjun Nair', date: '21 Jun 2026', status: 'pending' },
    { title: 'Kurti Set — Ananya Designs', customer: 'Sana Iqbal', date: '10 Jun 2026', status: 'done' },
  ];

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name ?? 'Admin';
    this.userInitials = this.getInitials(this.userName);

    // this.adminService.getStats().subscribe(stats => { ... });
    // this.adminService.getPendingApprovals().subscribe(list => this.pendingTailorApprovals = list);
    // this.adminService.getRecentOrders().subscribe(list => this.recentOrders = list);
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

  approveTailor(tailor: PendingTailor): void {
    // this.adminService.approveTailor(tailor.id).subscribe(...)
    this.pendingTailorApprovals = this.pendingTailorApprovals.filter(t => t !== tailor);
  }

  rejectTailor(tailor: PendingTailor): void {
    // this.adminService.rejectTailor(tailor.id).subscribe(...)
    this.pendingTailorApprovals = this.pendingTailorApprovals.filter(t => t !== tailor);
  }
}

interface PendingTailor {
  name: string;
  location: string;
  appliedOn: string;
}

interface RecentOrder {
  title: string;
  customer: string;
  date: string;
  status: 'active' | 'pending' | 'done';
}