import { Component, OnInit, Renderer2 } from '@angular/core';
import { PLATFORM_ID,  Inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { CustomerModel } from '../../models/CustomerModel';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router} from "@angular/router"
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
  private style: HTMLLinkElement | null = null;
  private cssFile: string = "";
  routeParams: any = {
    templateid: '',
  };
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private customerService: CustomerService,
    private titleService : Title,
    private storageService: StorageService,
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
    private router: Router,
    private route: ActivatedRoute) {
     this.titleService.setTitle("Redirecting...")
    }
    
    ngOnInit() {

      if(this.verifiyTemplatePreview())
      {
        return;
      }
      
        let savedUserInfo = this.storageService.getLoggedUserFromUserInfo();
        if(savedUserInfo.customerId == "")
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
                this.loadTemplateStyles();
                this.redirectUser(response[0]);
              },
              error: () => {
                this.router.navigateByUrl("/register");
              },
              complete:() => {
              }
          })
        }
          return;
        }
        else{
          this.loadTemplateStyles();
          this.redirectUser(savedUserInfo);
        }
  }

  verifiyTemplatePreview() : boolean
  {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.routeParams = {
          ...this.routeParams,
          ...params
        };
      }
    });

    if(this.routeParams.templateid)
    {
      this.storageService.removeUserInfo();
      this.customerService.customerExistWithPassedTemplate(this.routeParams.templateid)
      .subscribe({
        next: (response) => {
          if (response && response.length > 0 && response[0].customerId!="") {
            this.storageService.saveUserInfo(JSON.stringify(response[0]));
          }
          this.loadTemplateStyles();
          this.redirectUser(response[0]);
        },
        error: () => {
          this.router.navigateByUrl("/register");
        },
        complete:() => {
        }
      })
      return true;
    }
    return false;
  }

  loadTemplateStyles() {
    const userInfo = this.storageService.getLoggedUserFromUserInfo();
      switch (userInfo.templateId) {
        case '0b69c6031f111d63bc2c975dd2837e38': 
       // this.cssFile = `GreenTemplate.css`; 
          break;
        case '0b69c6031f111d63bc2c975dd2837e39': 
        //this.cssFile = `BlueTemplate.css`;    
          break;
      }
    
    this.style = this.renderer2.createElement('link') as HTMLLinkElement;

    // Set type of the link item and path to the css file
    this.renderer2.setProperty(this.style, 'rel', 'stylesheet');
    this.renderer2.setProperty(this.style, 'href', this.cssFile);
    this.renderer2.setProperty(this.style, 'id', "themeCSS");

    // Add the style to the head section
    this.renderer2.appendChild(this.document.head, this.style);
  }

  redirectUser(userInfo:CustomerModel)
  {
    if(userInfo && userInfo.customerId != "")
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
  }
}