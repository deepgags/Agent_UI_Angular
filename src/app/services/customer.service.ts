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

  async getCustomers(emailAddress:string): Promise<CustomerModel[]> {

    this.http.get<any>(this.Apiurl + '/login?emailAddress=' + emailAddress)
        .subscribe(data => 
            {
                data.data.forEach((customer: any) => {
                    this.customers.push(new CustomerModel(
                            customer.customerid,
                            customer.firstname,
                            customer.lastname,
                            customer.emailaddress,
                            customer.businessname,
                            customer.phonenumber,
                            customer.isapproved,
                            customer.roleid,
                            customer.templateid))
                });
          });
    
     return this.customers;
  }

}