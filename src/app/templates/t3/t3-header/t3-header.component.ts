import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { CustomerModel } from '../../../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { PhoneSearch } from '../../../Pipes/phoneSearch';
import { UpperCase } from '../../../Pipes/upper';

@Component({
  selector: 'app-t3-header',
  imports: [CommonModule, PhoneSearch, UpperCase],
  templateUrl: './t3-header.component.html',
  styleUrls: ['./t3-header.component.scss', '../t3.component.scss']
})
export class T3HeaderComponent implements OnInit  {
  customer: CustomerModel | undefined;
 
  constructor(private storageService: StorageService) {

   }

  ngOnInit(): void {
    this.customer = this.storageService.getLoggedUserFromUserInfo();
  }
}
