import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { AdminUser, AuthToken, LoginRequest, LoginResponse, ChangePasswordRequest, MeResponse } from '../models/auth.model';

const TOKEN_KEY = 'admin_token';
const TOKEN_EXPIRY_KEY = 'admin_token_expiry';
const USER_KEY = 'admin_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private apiBaseUrl = environment.apiBaseUrl;

  private currentUser = signal<AdminUser | null>(null);
  private token = signal<string | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());

  private authStateSubject = new BehaviorSubject<boolean>(this.hasStoredToken());
  readonly authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.hydrateFromStorage();
  }

  private hasStoredToken(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!token || !expiry) return false;
    return Date.now() < parseInt(expiry, 10);
  }

  private hydrateFromStorage(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const userData = localStorage.getItem(USER_KEY);

    if (token && expiry && userData && userData !== 'undefined') {
      const expiryTime = parseInt(expiry, 10);
      if (Date.now() < expiryTime) {
        try {
          this.token.set(token);
          this.currentUser.set(JSON.parse(userData));
          this.authStateSubject.next(true);
        } catch {
          this.clearStorage();
        }
      } else {
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(USER_KEY);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<{ data: LoginResponse }>(`${this.apiBaseUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          const data = response.data;
          if (data?.token && data?.admin) {
            const payload = this.decodeToken(data.token);
            const expiresAt = payload?.exp ? payload.exp * 1000 : Date.now() + 24 * 60 * 60 * 1000;
            this.token.set(data.token);
            this.currentUser.set(data.admin);
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiresAt));
            localStorage.setItem(USER_KEY, JSON.stringify(data.admin));
            this.authStateSubject.next(true);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Logged in successfully',
            });
          }
        }),
        map((response) => response.data)
      );
  }

  private decodeToken(token: string): { exp?: number } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  me(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiBaseUrl}/auth/me`).pipe(
      tap((response) => {
        this.currentUser.set(response.admin);
        localStorage.setItem(USER_KEY, JSON.stringify(response.admin));
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.clearStorage();
    this.authStateSubject.next(false);
    this.router.navigate(['/login']);
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been logged out',
    });
  }

  changePassword(request: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiBaseUrl}/auth/change-password`, request)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully',
          });
        })
      );
  }

  getToken(): string | null {
    return this.token();
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() >= parseInt(expiry, 10);
  }
}