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
  customerId: { name: string; email: string; phone: string } | string;
  tailorId: { name: string; shopName: string } | string;
  garmentType: string;
  style: string;
  budgetMin: number;
  budgetMax: number;
  tailorQuote?: number;
  status: string;
  expectedDelivery: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  

  private baseUrl = 'http://localhost:3000'; // your backend URL

  constructor(private http: HttpClient) {}
  

  

  createOrder(data: any) {
    return this.http.post(`${this.baseUrl}/orders/create`, data);
  }

  getMyOrders(customerId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/orders/customer/${customerId}`);
  }

 
getAdminOrders(params: { status?: string; search?: string; page?: number; limit?: number }) {
  let httpParams = new HttpParams();
  if (params.status) httpParams = httpParams.set('status', params.status);
  if (params.search) httpParams = httpParams.set('search', params.search);
  if (params.page) httpParams = httpParams.set('page', params.page.toString());
  if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());

  return this.http.get<AdminOrdersResponse>(`${this.baseUrl}/admin/orders`, { params: httpParams });
}

// --- New three-step quote flow ---

forwardToTailor(orderId: string) {
  return this.http.patch(`${this.baseUrl}/admin/orders/${orderId}/forward-to-tailor`, {});
}

getTailorQuotedOrders() {
  return this.http.get<any[]>(`${this.baseUrl}/admin/orders/tailor-quoted`);
}



getOrdersForTailor(tailorId: string) {
  return this.http.get<any[]>(`${this.baseUrl}/admin/orders/tailor/${tailorId}`);
}

updateOrderStatus(orderId: string, statusDto: { status: string }) {
  
  return this.http.patch(`${this.baseUrl}/admin/orders/${orderId}/status`, statusDto);
}

addMargin(orderId: string, adminMargin: number, adminNotes?: string) {
  return this.http.patch(`${this.baseUrl}/admin/orders/${orderId}/margin`, {
    adminMargin, adminNotes,
  });
}

getQuoteRequestsForTailor(tailorId: string) {
  return this.http.get<any[]>(`${this.baseUrl}/orders/tailor/${tailorId}/quote-requests`);
}

submitTailorQuote(orderId: string, tailorId: string, tailorQuote: number) {
  return this.http.patch(`${this.baseUrl}/orders/${orderId}/tailor-quote`, {
    tailorId, tailorQuote,
  });
}


}