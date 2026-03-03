import { Injectable, inject, signal, computed } from '@angular/core';
import { ApiService } from './api';
import { tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  currentUser = signal<any>(this.getUserFromStorage());

  // Computed signal to check if user is admin
  isAdmin = computed(() => {
    const user = this.currentUser();
    // Check for explicit role OR the specific admin email fallback
    return user?.role === 'admin' || user?.email === 'admin@lunara.com';
  });

  register(userData: any) {
    return this.api.post('https://api.everrest.educata.dev/auth/sign_up', userData).pipe(
      tap((res: any) => {
        // Everrest sign_up returns the user object directly.
        // It does not log the user in automatically, so they must log in manually,
        // which our UI requires anyway.
      })
    );
  }

  login(credentials: { email: string; password: string }) {
    // Manual Admin Fallback
    if (credentials.email.toLowerCase() === 'admin@lunara.com' && credentials.password === '12345') {
      const adminUser = { email: 'admin@lunara.com', role: 'admin', firstName: 'Admin', lastName: 'User', _id: 'manual_admin' };
      this.setUser(adminUser);
      return of({ user: adminUser });
    }

    return this.api.post('https://api.everrest.educata.dev/auth/sign_in', credentials).pipe(
      tap((res: any) => {
        if (res && res.access_token) {
          try {
            // Extract the user data directly from the Base64 JWT Payload
            const payloadDecoded = JSON.parse(atob(res.access_token.split('.')[1]));
            this.setAuthSession(res.access_token, payloadDecoded);
          } catch (e) {
            console.error("Failed to decode token", e);
          }
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('lunaraUser');
    localStorage.removeItem('lunaraToken');
    this.currentUser.set(null);
  }

  private setAuthSession(token: string, user: any) {
    localStorage.setItem('lunaraToken', token);
    this.setUser(user);
  }

  private setUser(user: any) {
    localStorage.setItem('lunaraUser', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getUserFromStorage() {
    const user = localStorage.getItem('lunaraUser');
    return user ? JSON.parse(user) : null;
  }
}
