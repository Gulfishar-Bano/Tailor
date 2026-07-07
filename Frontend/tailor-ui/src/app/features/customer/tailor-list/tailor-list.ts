import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { Navbar } from '../../navbar/navbar'; // adjust path to match your project

@Component({
  selector: 'app-tailor-list',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './tailor-list.html',
  styleUrl: './tailor-list.scss',
})
export class TailorList implements OnInit {

  private authService = inject(AuthService);

  tailors = signal<any[]>([]);

  ngOnInit(): void {
    this.loadTailors();
  }

  loadTailors() {
    this.authService.getTailors().subscribe({
      next: (res: any) => {
        this.tailors.set(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}