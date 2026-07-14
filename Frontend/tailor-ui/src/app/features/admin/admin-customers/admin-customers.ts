import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface AdminCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  age?: number;
  location?: string;
  createdAt: string;
}

export interface AdminCustomersResponse {
  customers: AdminCustomer[];
  total: number;
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminCustomersService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCustomers(params: { search?: string; page?: number; limit?: number }) {
    let httpParams = new HttpParams();
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<AdminCustomersResponse>(`${this.baseUrl}/admin/customers`, { params: httpParams });
  }

  getCustomerDetail(id: string) {
    return this.http.get<AdminCustomer>(`${this.baseUrl}/admin/customers/${id}`);
  }
}