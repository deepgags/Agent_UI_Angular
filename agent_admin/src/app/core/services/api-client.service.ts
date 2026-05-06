import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccess, ApiFailure, PaginatedResponse } from '../models/api.model';

export interface ListQuery {
  [key: string]: unknown;
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiClientOptions {
  skipErrorHandler?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  get<T>(endpoint: string, query?: ListQuery & Record<string, unknown>, options?: ApiClientOptions): Observable<T> {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`, { params }).pipe(
      map((response) => response.data),
      options?.skipErrorHandler ? catchError((err) => throwError(() => err)) : catchError(this.handleError)
    );
  }

  getPaginated<T>(endpoint: string, query?: ListQuery & Record<string, unknown>): Observable<PaginatedResponse<T>> {
    let params = new HttpParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<ApiSuccess<T[]>>(`${this.apiBaseUrl}${endpoint}`, { params }).pipe(
      map((response) => ({
        data: response.data,
        meta: (response as any).meta,
      })),
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: unknown, options?: ApiClientOptions): Observable<T> {
    return this.http.post<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`, body).pipe(
      map((response) => response.data),
      options?.skipErrorHandler ? catchError((err) => throwError(() => err)) : catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: unknown, options?: ApiClientOptions): Observable<T> {
    return this.http.put<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`, body).pipe(
      map((response) => response.data),
      options?.skipErrorHandler ? catchError((err) => throwError(() => err)) : catchError(this.handleError)
    );
  }

  patch<T>(endpoint: string, body: unknown, options?: ApiClientOptions): Observable<T> {
    return this.http.patch<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`, body).pipe(
      map((response) => response.data),
      options?.skipErrorHandler ? catchError((err) => throwError(() => err)) : catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string, options?: ApiClientOptions): Observable<T> {
    return this.http.delete<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`).pipe(
      map((response) => response.data),
      options?.skipErrorHandler ? catchError((err) => throwError(() => err)) : catchError(this.handleError)
    );
  }

  postFormData<T>(endpoint: string, body: FormData, options?: ApiClientOptions): Observable<T> {
    return this.http.post<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`, body).pipe(
      map((response) => response.data),
      options?.skipErrorHandler ? catchError((err) => throwError(() => err)) : catchError(this.handleError)
    );
  }

  patchFormData<T>(endpoint: string, body: FormData, options?: ApiClientOptions): Observable<T> {
    return this.http.patch<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`, body).pipe(
      map((response) => response.data),
      options?.skipErrorHandler ? catchError((err) => throwError(() => err)) : catchError(this.handleError)
    );
  }

  deleteImage<T>(templateKey: string, imageId: string, options?: ApiClientOptions): Observable<T> {
    return this.http.delete<ApiSuccess<T>>(`${this.apiBaseUrl}/templates/${templateKey}/images/${imageId}`).pipe(
      map((response) => response.data),
      options?.skipErrorHandler ? catchError((err) => throwError(() => err)) : catchError(this.handleError)
    );
  }

  uploadFile<T>(endpoint: string, file: File, fieldName: string = 'file'): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    return this.http.post<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`, formData).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  uploadFiles<T>(endpoint: string, files: File[], fieldName: string = 'files'): Observable<T> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fieldName, file);
    });
    return this.http.post<ApiSuccess<T>>(`${this.apiBaseUrl}${endpoint}`, formData).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  private handleError = (error: unknown) => {
    let errorMessage = 'An unexpected error occurred';
    if (typeof error === 'object' && error !== null) {
      const err = error as ApiFailure;
      errorMessage = err.message || err.error || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  };
}