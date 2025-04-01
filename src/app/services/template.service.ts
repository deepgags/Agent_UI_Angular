import { inject, Injectable, resource, signal } from '@angular/core';
import { TemplateModel } from '../models/TemplateModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

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

  async getTemplates(name:string = ''): Promise<TemplateModel[]> {
    this.http.get<any>(this.Apiurl + '?name=' + name)
        .subscribe(data => 
            {
                data.data.forEach((template: any) => {
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
          })
    
     return this.templates;
  }

}