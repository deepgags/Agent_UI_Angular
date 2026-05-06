import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

export const httpAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        messageService.add({
          severity: 'error',
          summary: 'Unauthorized',
          detail: 'Session expired. Please login again.',
        });
      } else if (error.status === 403) {
        messageService.add({
          severity: 'error',
          summary: 'Forbidden',
          detail: 'You do not have permission to perform this action.',
        });
      } else if (error.status >= 400 && error.status < 500) {
        const message = error.error?.message || error.error?.error || 'Client error';
        messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        });
      } else if (error.status >= 500) {
        messageService.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'An unexpected error occurred. Please try again later.',
        });
      }

      return throwError(() => error);
    })
  );
};