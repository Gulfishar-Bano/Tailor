// src/app/services/measurement.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MeasurementData {
  customerId: string;
  chest?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  length?: number;
  sleeveLength?: number;
  neck?: number;
  inseam?: number;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class MeasurementService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  save(data: MeasurementData) {
    return this.http.post<MeasurementData>(`${this.baseUrl}/measurements`, data);
  }

  getByCustomer(customerId: string) {
    console.log("getting called")
    return this.http.get<MeasurementData | null>(`${this.baseUrl}/measurements/customer/${customerId}`);
  }
}