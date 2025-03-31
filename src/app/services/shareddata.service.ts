import { Injectable } from '@angular/core';
import { CustomerModel } from '../models/CustomerModel';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private dataSource = new BehaviorSubject<any>(null);
  CustomerData = this.dataSource.asObservable();

  changeData(data: any) {
    this.dataSource.next(data);
  }
}