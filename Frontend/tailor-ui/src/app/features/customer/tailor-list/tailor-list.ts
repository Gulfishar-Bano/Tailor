import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-tailor-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Navbar],
  templateUrl: './tailor-list.html',
  styleUrl: './tailor-list.scss',
})
export class TailorList implements OnInit {
  private authService = inject(AuthService);

  tailors = signal<any[]>([]);
  searchTerm = '';

  filteredTailors = computed(() => {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.tailors();

    return this.tailors().filter(t =>
      t.name?.toLowerCase().includes(term) ||
      t.specialization?.toLowerCase().includes(term) ||
      t.city?.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadTailors();
  }

  loadTailors(): void {
    this.authService.getTailors().subscribe({
      next: (res: any) => this.tailors.set(res),
      error: (err) => console.error(err),
    });
  }

  onSearch(): void {
    // computed signal handles filtering automatically
  }

  getInitials(name: string): string {
    return (name || '')
      .split(' ')
      .filter(Boolean)
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}