import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface LoginResponse {
  message: string;
  user: CurrentUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseUrl = 'http://localhost:3000'; // your backend URL
  private userKey = 'currentUser';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data: any) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data).pipe(
      tap(res => {
        this.setCurrentUser(res.user);
      })
    );
  }

  getTailors() {
    return this.http.get<any[]>(`${this.baseUrl}/user/tailor/list`);
  }

  // full profile — specialization/experience/city/bio/portfolioImages included
  getTailorById(id: string) {
    return this.http.get<any>(`${this.baseUrl}/user/tailor/${id}`);
  }

  updateTailorPortfolio(tailorId: string, images: string[]) {
    return this.http.patch(`${this.baseUrl}/user/tailor/${tailorId}/portfolio`, { images });
  }

  updateTailorProfile(tailorId: string, updates: any) {
    return this.http.patch(`${this.baseUrl}/user/tailor/${tailorId}`, updates);
  }

  setCurrentUser(user: CurrentUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getCurrentUser(): CurrentUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
  }

  createOrder(data: any) {
    return this.http.post(`${this.baseUrl}/orders/create`, data);
  }

  getMyOrders(customerId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/orders/customer/${customerId}`);
  }
}