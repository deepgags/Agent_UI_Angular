import { inject, Injectable, resource, signal } from '@angular/core';
import { BrokerageTypeModel } from '../models/BrokerageTypeModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BrokerageTypeService {
  private brokerageTypes: BrokerageTypeModel[] = [];
  query = signal<string>("");
  private Apiurl:string ="";

 constructor(private http: HttpClient) {
    this.Apiurl = environment.agentApiUrl + environment.brokerageTypeUrl;
  }

  async getBrokerageTypes(name:string=''): Promise<BrokerageTypeModel[]> {

    this.http.get<any>(this.Apiurl + '?name=' + name)
        .subscribe(data => 
            {
                data.data.forEach((brokeragetype: any) => {
                    this.brokerageTypes.push(new BrokerageTypeModel(
                      brokeragetype.brokeragetypeid,
                      brokeragetype.name,
                      brokeragetype.isapproved,
                      brokeragetype.isdefault))
                });
          });
    
     return this.brokerageTypes;
  }

}