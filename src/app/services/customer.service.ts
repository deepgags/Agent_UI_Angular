import { inject, Injectable, resource, signal } from '@angular/core';
import { CustomerModel } from '../models/CustomerModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private customers: CustomerModel[] = [];
  private authToken: string = "";
  query = signal<string>("");
  private Apiurl:string ="";

 constructor(private http: HttpClient, private storageService: StorageService) {
    this.Apiurl = environment.agentApiUrl + environment.customerUrl;
  }

   login(userInfo:CustomerModel): Observable<any> {
    let content = {emailAddress: userInfo.emailAddress, password: userInfo.password};
    return this.http.post(this.Apiurl + '/login', content);
  }

  save(customer : CustomerModel) {
    return this.http.post(this.Apiurl + '/save', customer);
  }

  customerExistWithSiteUrl(siteUrl:string): Observable<any> {
    return this.http.get<CustomerModel[]>(this.Apiurl + '/siteExist?siteUrl=' + siteUrl)
        .pipe(
            catchError(error => {
                console.error('Error fetching customers:', error);
                return throwError(error);
            })
        );
  }

  getCustomers(emailAddress:string): Observable<any> {
    return this.http.get<any>(this.Apiurl + '/login?emailAddress=' + emailAddress)
        .pipe(
            catchError(error => {
                console.error('Error fetching customers:', error);
                return throwError(error);
            })
        );
  }

}