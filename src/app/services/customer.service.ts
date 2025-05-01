import { Injectable, signal } from '@angular/core';
import { CustomerModel } from '../models/CustomerModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BrokerageTypeModel } from '../models/BrokerageTypeModel';
import { RoleModel } from '../models/RoleModel';

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

  update(customer : CustomerModel) {
    return this.http.put(this.Apiurl + '/update', customer);
  }

  customerExistWithSiteUrl(siteUrl:string): Observable<CustomerModel> {

    return this.http.get<CustomerModel>(this.Apiurl + '/siteExist?siteUrl=' + siteUrl)
        .pipe(map((result: any) => {
          if(result && result.data)
          {
            const x = result.data;
            const customer = new CustomerModel(
            x.customerid,
            x.firstname,
            x.lastname,
            x.emailaddress,
            x.businessname,
            x.address,
            x.phonenumber,
            x.cellnumber,
            x.isapproved,
            x.roleid,
            x.templateid,
            x.brokeragetypeid,
            x.siteurl,
            x.logoimage,
            x.logoimagepath,
            x.profileimage,
            x.profileimagepath)
            
            customer.brokerage = new BrokerageTypeModel(x.brokerages.brokeragetypeid,
              x.brokerages.name, x.brokerages.alternatename,x.brokerages.logopath,x.brokerages.isapproved,x.brokerages.isdefault);

            customer.role=new RoleModel(x.roles.roleid,x.roles.name,x.roles.isapproved,x.roles.isdefault);

            return customer;
          }
          return this.customers[0];
    }),
        catchError(error => {
          console.error('Error fetching customers:', error);
          return throwError(() => error);
        }));
  }

  getCustomer(customerId:string): Observable<CustomerModel> {

    return this.http.get<CustomerModel>(this.Apiurl + '/getCustomers?id=' + customerId)
        .pipe(map((result: any) => {
          if(result && result.data  && result.data.length > 0)
          {
            const x = result.data[0];
            const customer = new CustomerModel(
            x.customerid,
            x.firstname,
            x.lastname,
            x.emailaddress,
            x.businessname,
            x.address,
            x.phonenumber,
            x.cellnumber,
            x.isapproved,
            x.roleid,
            x.templateid,
            x.brokeragetypeid,
            x.siteurl,
            x.logoimage,
            x.logoimagepath,
            x.profileimage,
            x.profileimagepath)
            
            customer.brokerage = new BrokerageTypeModel(x.brokerages.brokeragetypeid,
              x.brokerages.name, x.brokerages.alternatename,x.brokerages.logopath,x.brokerages.isapproved,x.brokerages.isdefault);

            customer.role=new RoleModel(x.roles.roleid,x.roles.name,x.roles.isapproved,x.roles.isdefault);

            return customer;
          }
          return this.customers[0];
    }),
        catchError(error => {
          console.error('Error fetching customers:', error);
          return throwError(() => error);
        }));
  }

  templatePreviewAvaiable(templateId:string): Observable<CustomerModel> {

    return this.http.get<CustomerModel>(this.Apiurl + '/customerByTemplateForPreview?templateid=' + templateId)
        .pipe(map((result: any) => {
          if(result && result.data && result.data.length > 0)
          {
            const x = result.data[0];
            const customer = new CustomerModel(
            x.customerid,
            x.firstname,
            x.lastname,
            x.emailaddress,
            x.address,
            x.businessname,
            x.phonenumber,
            x.isapproved,
            x.roleid,
            x.templateid,
            x.brokeragetypeid,
            x.siteurl)
            
            return customer;
          }
          return this.customers[0];
    }),
        catchError(error => {
          console.error('Error fetching customers:', error);
          return throwError(() => error);
        }));
  }

  getCustomers(emailAddress : string): Observable<CustomerModel> {

    return this.http.get<CustomerModel>(this.Apiurl + '/login?emailAddress=' + emailAddress)
    .pipe(map((result: any) => {
        if(result && result.data)
        {
          const loginData = result.data;
            return new CustomerModel(loginData.customerid, loginData.firstname, loginData.lastname,
              loginData.emailaddress, loginData.businessname, loginData.address, loginData.phonenumber, loginData.isapproved,
              loginData.roleid, loginData.templateid, loginData.brokeragetypeid, loginData.siteurl)
        }
          return {} as CustomerModel;
      }),
      catchError(error => {
        console.error('Error fetching customers:', error);
        return throwError(() => error);
      })
    )
  }

}