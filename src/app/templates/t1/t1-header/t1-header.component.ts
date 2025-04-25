import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { CustomerModel } from '../../../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { PhoneSearch } from '../../../Pipes/phoneSearch';
import { UpperCase } from '../../../Pipes/upper';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-t1-header',
  imports: [CommonModule, AngularSvgIconModule, PhoneSearch, UpperCase],
  templateUrl: './t1-header.component.html',
  styleUrls: ['./t1-header.component.scss', '../t1.component.scss']
})
export class T1HeaderComponent implements OnInit  {
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
