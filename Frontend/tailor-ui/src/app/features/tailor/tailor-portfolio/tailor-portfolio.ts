import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { OrderService } from '../../../services/order'; // reusing its uploadImages()

@Component({
  selector: 'app-tailor-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tailor-portfolio.html',
  styleUrl: './tailor-portfolio.scss',
})
export class TailorPortfolio implements OnInit {

  private authService = inject(AuthService);
  private orderService = inject(OrderService); // uploadImages lives here, not tied to orders specifically

  images = signal<string[]>([]);
  uploading = signal(false);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  savedMessage = signal<string | null>(null);

  private readonly MAX_IMAGES = 10;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  ngOnInit(): void {
    const tailor = this.authService.getCurrentUser();
    if (!tailor) return;

    this.authService.getTailorById(tailor.id).subscribe({
      next: (res) => this.images.set(res.portfolioImages ?? []),
      error: (err) => console.error(err),
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.errorMessage.set(null);
    this.savedMessage.set(null);

    if (this.images().length + files.length > this.MAX_IMAGES) {
      this.errorMessage.set(`You can have up to ${this.MAX_IMAGES} portfolio photos.`);
      input.value = '';
      return;
    }

    const oversized = files.find(f => f.size > this.MAX_FILE_SIZE);
    if (oversized) {
      this.errorMessage.set(`"${oversized.name}" is over 5MB.`);
      input.value = '';
      return;
    }

    this.uploading.set(true);
    this.orderService.uploadImages(files).subscribe({
      next: (res) => {
        this.images.update(current => [...current, ...res.urls]);
        this.uploading.set(false);
        input.value = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Upload failed — please try again.');
        this.uploading.set(false);
        input.value = '';
      },
    });
  }

  removeImage(url: string) {
    this.images.update(current => current.filter(img => img !== url));
  }

  save() {
    const tailor = this.authService.getCurrentUser();
    if (!tailor) return;

    this.saving.set(true);
    this.savedMessage.set(null);

    this.authService.updateTailorPortfolio(tailor.id, this.images()).subscribe({
      next: () => {
        this.saving.set(false);
        this.savedMessage.set('Portfolio saved!');
      },
      error: (err) => {
        console.error(err);
        this.saving.set(false);
        this.errorMessage.set('Could not save your portfolio. Please try again.');
      },
    });
  }
}