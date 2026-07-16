import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminOrder {
  _id: string;
  customerId: { _id: string; name: string; email: string; phone: string } | string | null;
  tailorId: { _id?: string; name: string; phone?: string; city?: string; specialization?: string } | string | null;
  garmentType: string;
  fabricColor?: string;
  description?: string;
  images?: string[];
  budgetMin?: number;
  budgetMax?: number;
  status: string;
  adminNotes?: string;
  expectedDelivery: string;
  createdAt: string;
  measurements?: {
    chest?: number;
    waist?: number;
    hip?: number;
    shoulder?: number;
    length?: number;
    sleeveLength?: number;
    neck?: number;
    inseam?: number;
    notes?: string;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // --- Customer ---

  createOrder(data: any) {
    return this.http.post(`${this.baseUrl}/orders/create`, data);
  }

  getMyOrders(customerId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/orders/customer/${customerId}`);
  }

  uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return this.http.post<{ urls: string[] }>(`${this.baseUrl}/orders/upload-images`, formData);
  }

  // --- Tailor ---

  getOrdersForTailor(tailorId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/admin/orders/tailor/${tailorId}`);
  }

  getQuoteRequestsForTailor(tailorId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/orders/tailor/${tailorId}/quote-requests`);
  }

  submitTailorQuote(orderId: string, tailorId: string, tailorQuote: number) {
    return this.http.patch(`${this.baseUrl}/orders/${orderId}/tailor-quote`, {
      tailorId, tailorQuote,
    });
  }

  // --- Admin ---

  getAdminOrders(params: { status?: string; search?: string; page?: number; limit?: number }) {
    let httpParams = new HttpParams();
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<AdminOrdersResponse>(`${this.baseUrl}/admin/orders`, { params: httpParams });
  }

  updateOrderStatus(orderId: string, status: string, adminNotes?: string) {
    return this.http.patch<{ message: string; order: AdminOrder }>(
      `${this.baseUrl}/admin/orders/${orderId}/status`,
      { status, adminNotes },
    );
  }

  forwardToTailor(orderId: string) {
    return this.http.patch(`${this.baseUrl}/admin/orders/${orderId}/forward-to-tailor`, {});
  }

  getTailorQuotedOrders() {
    return this.http.get<any[]>(`${this.baseUrl}/admin/orders/tailor-quoted`);
  }

  addMargin(orderId: string, adminMargin: number, adminNotes?: string) {
    return this.http.patch(`${this.baseUrl}/admin/orders/${orderId}/margin`, {
      adminMargin, adminNotes,
    });
  }

  requestDoorstepMeasurement(payload: {
    customerId: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    notes?: string;
  }) {
    return this.http.post(`${this.baseUrl}/doorstep-requests`, payload);
  }

}