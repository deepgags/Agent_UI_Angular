import { inject, Injectable, resource, signal } from '@angular/core';
import { TemplateModel } from '../models/TemplateModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TemplateService {
  private templates: TemplateModel[] = [];
  private authToken: string = "";
  query = signal<string>("");
  private Apiurl:string ="";

 constructor(private http: HttpClient) {
    this.Apiurl = environment.agentApiUrl + environment.templateUrl;
  }

  getTemplates(name:string = ''): Observable<TemplateModel[]> {
  
      return this.http.get<TemplateModel[]>(this.Apiurl + '?name=' + name)
          .pipe(map((result: any) => {
            
            if(result && result.data && result.data.length > 0)
            {
              result.data.forEach((template:any) => {
                this.templates.push({
                  TemplateId: template.templateid,
                  TemplateName: template.name,
                  Description: template.description,
                  Data: template.data,
                  Images: template.images.split(','),
                  IsApproved: template.isapproved,
                  IsDefault: template.isdefault,
              } as TemplateModel)
            })
          }
            return this.templates;
          }),
            catchError(error => {
              console.error('Error fetching templates:', error);
              return throwError(() => error);
            })
          );
    }
  }