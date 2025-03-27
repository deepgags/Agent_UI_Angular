import { inject, Injectable, resource, signal } from '@angular/core';
import { CustomerModel } from '../models/CustomerModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

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

 login(userInfo:CustomerModel) : Promise<Observable<string>> {
    let content = {emailAddress: userInfo.EmailAddress, password: userInfo.Password};
    const response = this.http.post<any>(this.Apiurl + '/login', content);
    
    response.subscribe(response => {
      this.storageService.saveToken(response.token);
      this.storageService.saveUserInfo(JSON.stringify(response.data));
    });
    
    return Promise.resolve(response as Observable<string>);
  }

  async save(customer : CustomerModel) : Promise<CustomerModel> {
    this.http.post<any>(this.Apiurl + '/save', customer).subscribe((data:any) => 
      {
            this.customers.push(new CustomerModel(data.message, data.status))
      });

    return this.customers[0];
  }

  async getCustomers(emailAddress:string): Promise<CustomerModel[]> {

    this.http.get<any>(this.Apiurl + '/login?emailAddress=' + emailAddress)
        .subscribe(data => 
            {
                data.data.forEach((customer: any) => {
                    this.customers.push(new CustomerModel(
                            data.message,
                            data.status,
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