import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { CustomerModel } from '../../../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { PhoneSearch } from '../../../Pipes/phoneSearch';
import { UpperCase } from '../../../Pipes/upper';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-t8-header',
  imports: [CommonModule, AngularSvgIconModule, PhoneSearch, UpperCase],
  templateUrl: './t8-header.component.html',
  styleUrls: ['./t8-header.component.scss', '../t8.component.scss']
})
export class T8HeaderComponent implements OnInit  {
  customer: CustomerModel | undefined;
  showSVG: boolean = false;
  showLogo: boolean = false;
 
  constructor(private storageService: StorageService,
    private router: Router
  ) {

   }

  ngOnInit(): void {
    this.customer = this.storageService.getLoggedUserFromUserInfo();
    this.showSVG = typeof this.customer.logoImagePath === 'string' && this.customer.logoImagePath.endsWith('.svg');
  }

  updateProfile()
  {
    this.router.navigateByUrl("profile");
  }
}
