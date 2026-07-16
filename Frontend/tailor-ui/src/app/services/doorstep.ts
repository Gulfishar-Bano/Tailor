// src/app/services/doorstep.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface DoorstepRequestData {
  _id?: string;
  customerId: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class DoorstepService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getByCustomer(customerId: string) {
    return this.http.get<DoorstepRequestData | null>(`${this.baseUrl}/doorstep-requests/customer/${customerId}`);
  }
}