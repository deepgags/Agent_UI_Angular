import { Injectable, signal } from '@angular/core';
import { CustomerModel } from '../models/CustomerModel';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InterestedUserModel } from '../models/InterestedUserModel';

@Injectable({
  providedIn: 'root'
})

export class InterestedUserService {
  private Apiurl:string ="";

 constructor(private http: HttpClient, private storageService: StorageService) {
    this.Apiurl = environment.agentApiUrl + environment.interestedUserUrl;
  }

  save(user : InterestedUserModel) {
    return this.http.post(this.Apiurl + '/save', user);
  }

}