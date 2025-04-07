import { Component, OnInit } from '@angular/core';
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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-template',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
  MatInputModule, NgbModule],
  providers: [NgbCarouselConfig],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})

export class TemplateComponent implements OnInit {

  templateForm!: FormGroup;
  customerModel: CustomerModel = new CustomerModel();
  private templatesSubject = new BehaviorSubject<TemplateModel[]>([]);
  templates$ = this.templatesSubject.asObservable();

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
  
  constructor(
    private _siteDialog: MatDialog,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    private titleService : Title,
    private loadingService: LoadingService,
    private sharedDataService: SharedDataService) {
      this.titleService.setTitle("Templates")
    }
    
    ngOnInit() {
      this.sharedDataService.CustomerData.subscribe(data => {
        this.customerModel = data;
        this.getTemplates();
      });
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