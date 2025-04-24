import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { CustomerModel } from '../../../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { PhoneSearch } from '../../../Pipes/phoneSearch';

@Component({
  selector: 'app-t3-footer',
  imports: [CommonModule, PhoneSearch],
  templateUrl: './t3-footer.component.html',
  styleUrls: ['./t3-footer.component.scss', '../t3.component.scss']
})
export class T3FooterComponent implements OnInit  {

  customer: CustomerModel | undefined;
 
  constructor(private storageService: StorageService) {

   }

  ngOnInit(): void {
    this.customer = this.storageService.getLoggedUserFromUserInfo();
  }

}
