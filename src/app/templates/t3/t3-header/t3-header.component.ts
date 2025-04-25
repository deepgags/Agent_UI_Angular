import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { CustomerModel } from '../../../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { PhoneSearch } from '../../../Pipes/phoneSearch';
import { UpperCase } from '../../../Pipes/upper';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-t3-header',
  imports: [CommonModule, AngularSvgIconModule, PhoneSearch, UpperCase],
  templateUrl: './t3-header.component.html',
  styleUrls: ['./t3-header.component.scss', '../t3.component.scss']
})
export class T3HeaderComponent implements OnInit  {
  customer: CustomerModel | undefined;
  showSVG: boolean = false;
  showLogo: boolean = false;
 
  constructor(private storageService: StorageService) {

   }

  ngOnInit(): void {
    this.customer = this.storageService.getLoggedUserFromUserInfo();
    this.showSVG = typeof this.customer.logoImagePath === 'string' && this.customer.logoImagePath.endsWith('.svg');
  }
}
