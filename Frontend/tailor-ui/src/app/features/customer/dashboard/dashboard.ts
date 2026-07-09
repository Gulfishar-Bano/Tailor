import { Component, OnInit, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { Navbar } from '../../navbar/navbar'; // adjust path to match your project
import { RevealOnScrollDirective } from '../../../shared/reveal-on-scroll.directive'; // adjust path
import { MeasurementChoiceModal } from '../../measurement-choice-modal/measurement-choice-modal'; // adjust path to match your project

interface Category {
  name: string;
   image: string;
  
}

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar, RevealOnScrollDirective, MeasurementChoiceModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class CustomerDashboard implements OnInit {
  private authService = inject(AuthService);

  @ViewChild('categoryTrack') categoryTrack?: ElementRef<HTMLElement>;
  @ViewChild('portfolioTrack') portfolioTrack?: ElementRef<HTMLElement>;

  userName = this.authService.getCurrentUser()?.name ?? 'Guest';

  // TODO: replace with real values from your order/measurement services
  activeOrders = 2;
  savedMeasurements = 3;
  favoriteTailors = 5;

  showMeasurementModal = signal(false);

  
categories: Category[] = [
  { name: 'Lehenga',      image: 'https://images.unsplash.com/photo-1746372283841-dbb3838f9935?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGVoZW5nYXxlbnwwfHwwfHx8MA%3D%3D' },
  { name: 'Kurti',        image: 'https://images.unsplash.com/photo-1741847639057-b51a25d42892?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8S3VydGl8ZW58MHx8MHx8fDA%3D' },
  { name: 'Bridal Wear',  image: 'https://images.unsplash.com/photo-1610047614301-13c63f00c032?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJpZGFsJTIwd2VhcnxlbnwwfHwwfHx8MA%3D%3D' },
  { name: "Men's Wear",   image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80' },
  { name: 'Salwar Suit',  image: 'https://images.unsplash.com/photo-1597983073750-16f5ded1321f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Fsd2FyJTIwc3VpdHxlbnwwfHwwfHx8MA%3D%3D' },
  { name: 'Kids Wear',    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&q=80' },
  { name: 'Alterations',  image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80' },
];

  // Real portfolio photos pulled from tailors — falls back to an
  // illustrated empty state if none exist yet
  portfolioItems = signal<{ img: string; tailorName: string }[]>([]);
  loadingPortfolio = signal(true);

  ngOnInit(): void {
    this.loadPortfolioShowcase();
  }

  private loadPortfolioShowcase(): void {
    this.authService.getTailors().subscribe({
      next: (tailors: any[]) => {
        const items: { img: string; tailorName: string }[] = [];
        tailors.forEach(t => {
          (t.portfolioImages ?? []).forEach((img: string) => {
            items.push({ img, tailorName: t.name });
          });
        });
        this.portfolioItems.set(items.slice(0, 12));
        this.loadingPortfolio.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.loadingPortfolio.set(false);
      },
    });
  }

  openFindTailorFlow(): void {
    this.showMeasurementModal.set(true);
  }

  scrollCategories(direction: 'left' | 'right'): void {
    const el = this.categoryTrack?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' });
  }

  scrollPortfolio(direction: 'left' | 'right'): void {
    const el = this.portfolioTrack?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -280 : 280, behavior: 'smooth' });
  }
}