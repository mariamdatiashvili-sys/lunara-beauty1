import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  // Using the same MockAPI base URL from the previous project
  private readonly API_BASE_URL = "https://696bd26e624d7ddccaa22077.mockapi.io/api/v1";

  private getUrl(endpoint: string): string {
    return endpoint.startsWith('http') ? endpoint : `${this.API_BASE_URL}/${endpoint}`;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.getUrl(endpoint));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(this.getUrl(endpoint), data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(this.getUrl(endpoint), data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.getUrl(endpoint));
  }
}
