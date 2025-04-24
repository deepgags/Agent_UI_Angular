import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { CustomerModel } from '../../../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { PhoneSearch } from '../../../Pipes/phoneSearch';

@Component({
  selector: 'app-t2-header',
  imports: [CommonModule, PhoneSearch],
  templateUrl: './t2-header.component.html',
  styleUrls: ['./t2-header.component.scss', '../t2.component.scss']
})
export class T2HeaderComponent implements OnInit  {
  customer: CustomerModel | undefined;
 
  constructor(private storageService: StorageService) {

   }

  ngOnInit(): void {
    this.customer = this.storageService.getLoggedUserFromUserInfo();
  }
}
