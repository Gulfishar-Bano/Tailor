import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { OrderService } from '../../../services/order'; // reusing its uploadImages() — generic upload endpoint
import { ReviewService } from '../../../services/review';
import { AdminNavbar } from '../../admin-navbar/admin-navbar'; // adjust path to match your project

type ModalMode = 'edit' | 'portfolio' | 'review' | null;

@Component({
  selector: 'app-admin-tailor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbar],
  templateUrl: './admin-tailor-list.html',
  styleUrl: './admin-tailor-list.scss',
})
export class AdminTailorList implements OnInit {
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private reviewService = inject(ReviewService);

  tailors = signal<any[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);
  searchTerm = '';

  activeTailor = signal<any | null>(null);
  modalMode = signal<ModalMode>(null);
  saving = signal(false);

  // --- Edit profile form state ---
  editName = '';
  editPhone = '';
  editCity = '';
  editSpecialization = '';
  editExperience: number | null = null;
  editBio = '';

  // --- Portfolio state ---
  portfolioImages = signal<string[]>([]);
  uploadingPortfolio = signal(false);
  portfolioError = signal<string | null>(null);
  private readonly MAX_PORTFOLIO_IMAGES = 10;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // --- Add review state ---
  reviewCustomerName = '';
  reviewRating = 5;
  reviewComment = '';
  starRow = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.loadTailors();
  }

  loadTailors(): void {
    this.loading.set(true);
    this.authService.getTailors().subscribe({
      next: (res: any[]) => {
        this.tailors.set(res);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage.set('Could not load tailors.');
        this.loading.set(false);
      },
    });
  }

  get filteredTailors() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.tailors();
    return this.tailors().filter(t =>
      t.name?.toLowerCase().includes(term) ||
      t.specialization?.toLowerCase().includes(term) ||
      t.city?.toLowerCase().includes(term)
    );
  }

  // ------------------------------------------------------------------
  // Edit profile
  // ------------------------------------------------------------------

  openEdit(tailor: any): void {
    this.activeTailor.set(tailor);
    this.modalMode.set('edit');
    this.editName = tailor.name ?? '';
    this.editPhone = tailor.phone ?? '';
    this.editCity = tailor.city ?? '';
    this.editSpecialization = tailor.specialization ?? '';
    this.editExperience = tailor.experience ?? null;
    this.editBio = tailor.bio ?? '';
  }

  saveEdit(): void {
    const tailor = this.activeTailor();
    if (!tailor) return;

    this.saving.set(true);
    this.authService.updateTailorProfile(tailor._id, {
      name: this.editName,
      phone: this.editPhone,
      city: this.editCity,
      specialization: this.editSpecialization,
      experience: this.editExperience,
      bio: this.editBio,
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.loadTailors();
      },
      error: (err: any) => {
        console.error(err);
        this.saving.set(false);
      },
    });
  }

  // ------------------------------------------------------------------
  // Portfolio
  // ------------------------------------------------------------------

  openPortfolio(tailor: any): void {
    this.activeTailor.set(tailor);
    this.modalMode.set('portfolio');
    this.portfolioImages.set(tailor.portfolioImages ?? []);
  }

  onPortfolioFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.portfolioError.set(null);

    if (this.portfolioImages().length + files.length > this.MAX_PORTFOLIO_IMAGES) {
      this.portfolioError.set(`You can have up to ${this.MAX_PORTFOLIO_IMAGES} portfolio photos.`);
      input.value = '';
      return;
    }

    const oversized = files.find(f => f.size > this.MAX_FILE_SIZE);
    if (oversized) {
      this.portfolioError.set(`"${oversized.name}" is over 5MB.`);
      input.value = '';
      return;
    }

    this.uploadingPortfolio.set(true);
    this.orderService.uploadImages(files).subscribe({
      next: (res) => {
        this.portfolioImages.update(current => [...current, ...res.urls]);
        this.uploadingPortfolio.set(false);
        input.value = '';
      },
      error: (err: any) => {
        console.error(err);
        this.portfolioError.set('Upload failed — please try again.');
        this.uploadingPortfolio.set(false);
        input.value = '';
      },
    });
  }

  removePortfolioImage(url: string): void {
    this.portfolioImages.update(current => current.filter(img => img !== url));
  }

  savePortfolio(): void {
    const tailor = this.activeTailor();
    if (!tailor) return;

    this.saving.set(true);
    this.authService.updateTailorPortfolio(tailor._id, this.portfolioImages()).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
        this.loadTailors();
      },
      error: (err: any) => {
        console.error(err);
        this.saving.set(false);
      },
    });
  }

  // ------------------------------------------------------------------
  // Add review
  // ------------------------------------------------------------------

  openReview(tailor: any): void {
    this.activeTailor.set(tailor);
    this.modalMode.set('review');
    this.reviewCustomerName = '';
    this.reviewRating = 5;
    this.reviewComment = '';
  }

  setReviewRating(value: number): void {
    this.reviewRating = value;
  }

  saveReview(): void {
    const tailor = this.activeTailor();
    if (!tailor) return;

    this.saving.set(true);
    this.reviewService.createAdminReview({
      tailorId: tailor._id,
      customerName: this.reviewCustomerName || undefined,
      rating: this.reviewRating,
      comment: this.reviewComment || undefined,
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeModal();
      },
      error: (err: any) => {
        console.error(err);
        this.saving.set(false);
      },
    });
  }

  closeModal(): void {
    this.modalMode.set(null);
    this.activeTailor.set(null);
  }
}