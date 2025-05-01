import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Gallery, GalleryConfig, GalleryModule, GalleryRef, ImageItem, ThumbnailsPosition } from 'ng-gallery';
import { CustomerModel } from '../../models/CustomerModel';
import { TemplateModel } from '../../models/TemplateModel';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CustomerService } from '../../services/customer.service';
import { StorageService } from '../../services/storage.service';
import { TemplateService } from '../../services/template.service';
import { SharedDataService } from '../../services/shareddata.service';
import { DomSanitizer, SafeStyle, Title } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { NgxColorPaletteComponent } from 'ngx-color-palette';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-usertemplate',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, GalleryModule, NgxColorPaletteComponent],
  //providers:[{ provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }],
  templateUrl: './usertemplate.component.html',
  styleUrl: './usertemplate.component.scss'
})
export class UsertemplateComponent {
  isBrowser: boolean = false;
  primaryColor: string = '';
  secondaryColor: string = '';
  otherColor: string = '';
  hasColor: boolean = this.primaryColor != '' && this.secondaryColor != '';
  templateForm!: FormGroup;
  customerModel: CustomerModel = new CustomerModel();
  private templatesSubject = new BehaviorSubject<TemplateModel[]>([]);
  templates$ = this.templatesSubject.asObservable();

  galleryConfig$: Observable<GalleryConfig> | undefined;
  galleryRef: GalleryRef | undefined;

  color = '#FBC02D';

  constructor(
    breakpointObserver: BreakpointObserver,
    private gallery: Gallery,
    private customerService: CustomerService,
    private storageService: StorageService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    private titleService : Title,
    private loadingService: LoadingService,
    private sharedDataService: SharedDataService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
      this.titleService.setTitle('Templates');

      this.isBrowser = isPlatformBrowser(platformId);
      this.galleryConfig$ = breakpointObserver.observe([
        Breakpoints.HandsetPortrait
      ]).pipe(
        map(res => {
          if (res.matches) {
            return {
              thumbPosition: ThumbnailsPosition.Top,
              thumbWidth: 80,
              thumbHeight: 80
            };
          }
          return {
            thumbPosition: ThumbnailsPosition.Left,
            thumbWidth: 120,
            thumbHeight: 90
          };
        }));
    }

    ngOnInit() {
      const customer = this.storageService.getLoggedUserFromUserInfo();

      this.customerService.getCustomer(customer?.customerId)
      .subscribe({
        next: (response) => {
          if (response && response.customerId!="") {
            this.customerModel = response;

          }
        },
        error: () => {
          this.notificationService.showNotification("An error has occurred while getting customer information")
        },
        complete:() => {
        }
    })
        this.getTemplates();
        this.setGalleryImages();
    }

    getTemplates()
    {
      this.loadingService.loadingOn();
      this.templateService.getTemplates().subscribe({
          next: (response) => {
            if (response && response.length > 0) {
               this.templatesSubject.next(response);
            }
          },
          error: () => {
            this.notificationService.showNotification("Error occurred while getting templates");
          },
          complete: () => {this.loadingService.loadingOff()}
        });
    }

    setGalleryImages()
    {
      this.templatesSubject.subscribe(x=>
      {
        x.forEach(template=>
          {
            this.galleryRef = this.gallery.ref(template.TemplateId);
            template.Images?.forEach(x=>
              {
                if (this.galleryRef) {
                  this.galleryRef.add(new ImageItem(
                    {
                      src : x,
                      thumb : x
                    }));
              }})
          })
      });
    }

    selectTemplate(template:TemplateModel, sender:any)
      {
        template.IsSelected = !template.IsSelected;
        if(template.IsSelected)
        {
          this.customerModel.templateId = template.TemplateId;
        }

        this.templates$.subscribe(x=> x.forEach( item => {
          if(template.TemplateId!=item.TemplateId)
            {
              item.IsSelected = false
            }
        }));
    }

    previewTemplate(template:TemplateModel, sender:any)
    {
      this.loadingService.loadingOn();
      this.customerService.templatePreviewAvaiable(template.TemplateId)
      .subscribe({
        next: (response) => {
          if (response && response.customerId != "") {
            this.storageService.saveUserInfo(JSON.stringify(response));
            this.router.navigate([]).then(result => {  window.open('loading', '_blank'); });
            return;
          }
          this.notificationService.showNotification('No data exist for template preview')
        },
        error: () => {
          this.notificationService.showNotification('Error occurred exist while template preview')
        },
        complete:() => {
          this.loadingService.loadingOff()
        }
    })
    }

    save() {
      if (this.customerModel.templateId!="")
      {
        this.notificationService.showNotification("Template updated successfully");
      }
      else
      {
        this.notificationService.showNotification("Please select template")
      }
     }

    currentColor(event: any, type: string) { // to receive output
      switch(type)
      {
        case "primary":
          this.primaryColor = event.color;
          break;
        case "secondary":
          this.secondaryColor = event.color;
          break;
        default:
          this.otherColor = event.color;
          break;
      }
    }
}
