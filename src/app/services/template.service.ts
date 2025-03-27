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

  async getTemplate(name:string): Promise<TemplateModel[]> {

    this.http.get<any>(this.Apiurl + '?name=' + name)
        .subscribe(data => 
            {
                data.data.forEach((template: any) => {
                    this.templates.push(new TemplateModel(
                            data.message,
                            data.status,
                            template.templateid,
                            template.name,
                            template.description,
                            template.data,
                            template.images,
                            template.isapproved,
                            template.isdefault))
                });
          });
    
     return this.templates;
  }

}