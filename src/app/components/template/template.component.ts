import { Component, OnInit, AfterViewInit, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerModel } from '../../models/CustomerModel';
import { CommonModule } from '@angular/common';
import { TemplateModel } from '../../models/TemplateModel';
import { TemplateService } from '../../services/template.service';
import { NgbCarouselConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TemplatesiteComponent } from '../dialogs/templatesite/templatesite.component';
import { NotificationService } from '../../services/notification.service';
import { SharedDataService } from '../../services/shareddata.service';
import { Title } from '@angular/platform-browser';
import { LoadingService } from '../../services/loading.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Gallery, GalleryConfig, GalleryModule, GalleryRef, ImageItem, ThumbnailsPosition } from 'ng-gallery';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-template',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
  MatInputModule, NgbModule, GalleryModule],
  providers: [provideAnimations(), NgbCarouselConfig],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})

export class TemplateComponent implements OnInit, AfterViewInit, OnDestroy {

  templateForm!: FormGroup;
  customerModel: CustomerModel = new CustomerModel();
  private templatesSubject = new BehaviorSubject<TemplateModel[]>([]);
  templates$ = this.templatesSubject.asObservable();

  galleryConfig$: Observable<GalleryConfig> | undefined;
  galleryRef: GalleryRef | undefined;
  
  constructor(
    breakpointObserver: BreakpointObserver,
    private host: ElementRef, 
    private zone: NgZone,
    private gallery: Gallery,
    private _siteDialog: MatDialog,
    private customerService: CustomerService,
    private storageService: StorageService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    private titleService : Title,
    private loadingService: LoadingService,
    private sharedDataService: SharedDataService,
    private router: Router) {
      
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
      debugger;
      const observer = new ResizeObserver(entries => {
        this.zone.run(() => {})
        // const width = entries[0].contentRect.width;
        // console.log(width);
      });
      // this.observer = new ResizeObserver(entries => {
      //   this.zone.run(() => {
      //     this.width = entries[0].contentRect.width;
      //   });
      // });
  
      observer.observe(this.host.nativeElement);    
      //this.getTemplates();
      // this.sharedDataService.CustomerData.subscribe(data => {
      //   debugger;
      //   this.customerModel = data;
       
      // });
      this.getTemplates();
    //  this.customerModel = this.sharedDataService.CustomerData;
    }

    ngOnDestroy() {
      //this.observer.unobserve(this.host.nativeElement);
    }

    ngAfterViewInit()
    {
      //requestAnimationFrame(() => this.titleService.setTitle("Templates"));
      
      // this.sharedDataService.CustomerData.subscribe(data => {
      //   debugger;
      //   this.customerModel = data;
      // });
    }

    getTemplates()
    {
      this.loadingService.loadingOn();
      this.templateService.getTemplates().subscribe({
          next: (response) => {
            if (response && response.length > 0) {
               this.templatesSubject.next(response);
               this.setGalleryImages();
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
          requestAnimationFrame(() => {
            // Add logic here if needed, or remove this call if unnecessary
          });
      });
    }

    openDialog() {
       this._siteDialog.open(TemplatesiteComponent,
           {
              width      : '50%',
              height     : 'auto',
              disableClose : true,
              autoFocus : false,
              restoreFocus : false,
              hasBackdrop: true,
              data       :  this.customerModel
           }
        )
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
        this.openDialog();
      } 
      else
      {
        this.notificationService.showNotification("Please select template")
      }
  }
}