import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { TemplateModel } from '../models/TemplateModel';

@Injectable({
  providedIn: 'root'
})

export class TemplateService {
  private baseUrl: string = environment.agentApiUrl;

  constructor(private http: HttpClient) { }

  getTemplates() {
    return this.http.get(`${this.baseUrl}/templates`);
  }
}