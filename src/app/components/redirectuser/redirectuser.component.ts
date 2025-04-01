import { Component, OnInit } from '@angular/core';
import { PLATFORM_ID,  Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CustomerModel } from '../../models/CustomerModel';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { Router} from "@angular/router"
import { StorageService } from '../../services/storage.service';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-redirectuser',
  imports: [CommonModule],
  templateUrl: './redirectuser.component.html',
  styleUrl: './redirectuser.component.scss'
})

export class RedirectUserComponent implements OnInit {

  customerModel: CustomerModel = new CustomerModel();
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private customerService: CustomerService,
    private titleService : Title,
    private storageService: StorageService,
    private router: Router) {
     this.titleService.setTitle("Redirecting...")
    }
    
    ngOnInit() {
      const savedUserInfo = this.storageService.getLoggedUserFromUserInfo();
      if(savedUserInfo)
      {
          var isBrowser = isPlatformBrowser(this.platformId);
          if (isBrowser) {
            var currentUrl = window.location.host;
            this.customerService.customerExistWithSiteUrl(currentUrl)
            .subscribe({
              next: (response) => {
                if (response && response.length > 0 && response[0].customerId!="") {
                  this.storageService.saveUserInfo(JSON.stringify(response[0]));
                }
                
                const userInfo = this.storageService.getLoggedUserFromUserInfo();
                if(userInfo.customerId != "")
                {
                  switch(userInfo.templateId)
                  {
                    case "0b69c6031f111d63bc2c975dd2837e38":
                      this.router.navigateByUrl("/t1");
                      break;
                    case "0b69c6031f111d63bc2c975dd2837e39":
                      this.router.navigateByUrl("/t2");
                      break;
                    case "0b69c6031f111d63bc2c975dd2837e40":
                        this.router.navigateByUrl("/t3");
                        break;
                    case "0b69c6031f111d63bc2c975dd2837e41":
                        this.router.navigateByUrl("/t4");
                          break;
                    default:
                        this.router.navigateByUrl("/register");
                  }               
                }
                else{
                  this.router.navigateByUrl("/register");
                }
              },
              error: () => {
                this.router.navigateByUrl("/register");
              },
              complete:() => {
              }
          })}
      }
  }
}