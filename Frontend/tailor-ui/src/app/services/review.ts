import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTailorReviews(tailorId: string) {
    return this.http.get<{ averageRating: number; count: number; reviews: any[] }>(
      `${this.baseUrl}/reviews/tailor/${tailorId}`
    );
  }

  createReview(data: { tailorId: string; customerId: string; orderId: string; rating: number; comment?: string }) {
    return this.http.post(`${this.baseUrl}/reviews/create`, data);
  }

  createAdminReview(data: { tailorId: string; customerName?: string; rating: number; comment?: string }) {
    return this.http.post(`${this.baseUrl}/reviews/admin/create`, data);
  }
}