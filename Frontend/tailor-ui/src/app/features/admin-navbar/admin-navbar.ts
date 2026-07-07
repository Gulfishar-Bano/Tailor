import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: { label: string; route: string }[];
  expanded?: boolean;
}

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.scss',
})
export class AdminNavbar {
  sidebarCollapsed = signal(false);
  adminName = 'Tailor Admin';
  adminRole = 'Super Admin';

  navSections: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/admin/dashboard' },
    {
      label: 'User Management',
      icon: '👥',
      expanded: false,
      children: [
        { label: 'Customers', route: '/admin/customers' },
        { label: 'Tailors', route: '/admin/tailors' },
      ],
    },
    { label: 'Orders', icon: '📦', route: '/admin/orders' },
    { label: 'Reports', icon: '📈', route: '/admin/reports' },
    {
      label: 'Content Management',
      icon: '📄',
      expanded: false,
      children: [
        { label: 'Banners', route: '/admin/content/banners' },
        { label: 'Categories', route: '/admin/content/categories' },
      ],
    },
    { label: 'Reviews', icon: '⭐', route: '/admin/reviews' },
    { label: 'Settings', icon: '⚙️', route: '/admin/settings' },
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleSection(section: NavItem): void {
    if (section.children) {
      section.expanded = !section.expanded;
    }
  }

  logout(): void {
    // wire this to your AuthService.logout()
    console.log('Logging out...');
  }
}