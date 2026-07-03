import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  private baseUrl = 'http://localhost:3000'; // your backend URL

  constructor(private http: HttpClient) {}

  createOrder(data: any) {
    return this.http.post(`${this.baseUrl}/orders/create`, data);
  }
}