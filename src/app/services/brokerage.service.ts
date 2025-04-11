import { inject, Injectable, resource, signal } from '@angular/core';
import { BrokerageTypeModel } from '../models/BrokerageTypeModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

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

  getBrokerageTypes(name:string=''): Observable<BrokerageTypeModel[]> {
    
        return this.http.get<BrokerageTypeModel[]>(this.Apiurl + '?name=' + name)
            .pipe(map((result: any) => {
              if(result && result.data && result.data.length > 0)
              {
                result.data.forEach((brokeragetype:any) => {
                  this.brokerageTypes.push(new BrokerageTypeModel(
                    brokeragetype.brokeragetypeid,
                    brokeragetype.name,
                    brokeragetype.alternatename,
                    brokeragetype.logopath,
                    brokeragetype.isapproved,
                    brokeragetype.isdefault))
                })
              }

              return this.brokerageTypes;
            }),
              catchError(error => {
                console.error('Error fetching brokerage types:', error);
                return throwError(() => error);
              })
            );
      }
    }