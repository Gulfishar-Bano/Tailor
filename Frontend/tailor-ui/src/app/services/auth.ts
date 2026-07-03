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

  // REGISTER API
  register(data: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // LOGIN API — stores the returned user so the rest of the app can read it back
  login(data: any) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data).pipe(
      tap(res => {
        this.setCurrentUser(res.user);
      })
    );
  }

  getTailors() {
    return this.http.get(`${this.baseUrl}/user/tailor/list`);
  }

  // ---------------------------------------------------------------------
  // Session helpers
  // ---------------------------------------------------------------------

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
}