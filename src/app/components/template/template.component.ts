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
  templates: TemplateModel[] = [];

  images = [
    "https://media.istockphoto.com/id/1311600080/photo/small-shipping-packages-on-a-notebook-with-the-inscription-online-shopping.jpg?s=1024x1024&w=is&k=20&c=VvROXDiVybH5cjLcumXAcyKlzZJ11hCSVr1_abHs42w=",
   "https://media.istockphoto.com/id/1467976868/photo/the-convenience-of-shopping-online.jpg?s=1024x1024&w=is&k=20&c=TW1sWVSVTo-GtbD7tLz3IO98v_JUJWqAnbgMrjtKLfs=",
    "https://media.istockphoto.com/id/1336136316/photo/woman-online-shopping-on-smart-phone-fashion-clothes-at-home.webp?s=1024x1024&w=is&k=20&c=h8kYPGldqOh6Bg80sivXiVe-opkuk7COHR2MW7Z6op0=",
     "https://media.istockphoto.com/id/1165069915/photo/shopping-bags-in-shopping-cart-and-credit-card-on-laptop-with-paper-boxes-on-table-and-sales.jpg?s=1024x1024&w=is&k=20&c=Fvp_9Je6Mwj8WWiNgjMk1Enpi-foLW6rmoHx248Dgew=",
    "https://media.istockphoto.com/id/1312231371/photo/hand-touching-to-virtual-info-graphics-with-trolley-cart-icons-technology-online-shopping.jpg?s=1024x1024&w=is&k=20&c=QAwjsNOPl9YdAXLtv7SHi_GErUTIxxnlGak11tMVZho="
  ];

  selectTemplate(template:TemplateModel, sender:any)
  {
    template.IsSelected = !template.IsSelected;
    if(template.IsSelected)
    {
      this.customerModel.templateId = template.TemplateId;
    }

    this.templates.forEach( x=> {if(template.TemplateId!=x.TemplateId){ x.IsSelected = false }});
  }
  
  constructor(
    private _siteDialog: MatDialog,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    private sharedDataService: SharedDataService) {
    }
    
    ngOnInit() {
      this.sharedDataService.CustomerData.subscribe(data => {
        this.customerModel = data;
      });

      this.getTemplates();
//       this.templates.push(new TemplateModel(),
//     {
//             Data:"",
//             Description:"Template Description 1",
//             Images: this.images,
//             IsApproved:true,
//             IsDefault:true,
//             TemplateId:"ABC",
//             TemplateName:"Template 1",
//             IsSelected  :false
//     },
//     {
//       Data:"",
//       Description:"Template Description 1",
//       Images: this.images,
//       IsApproved:true,
//       IsDefault:true,
//       TemplateId:"XYZ",
//       TemplateName:"Template 2",
//       IsSelected  :false
// },
// {
//   Data:"",
//   Description:"Template Description 3",
//   Images: this.images,
//   IsApproved:true,
//   IsDefault:true,
//   TemplateId:"ABC 3",
//   TemplateName:"Template 3",
//   IsSelected  :false
// },
// {
//   Data:"",
//   Description:"Template Description 4",
//   Images: this.images,
//   IsApproved:true,
//   IsDefault:true,
//   TemplateId:"ABC 4",
//   TemplateName:"Template 4",
//   IsSelected  :false
// },
// {
//   Data:"",
//   Description:"Template Description 5",
//   Images: this.images,
//   IsApproved:true,
//   IsDefault:true,
//   TemplateId:"ABC 5",
//   TemplateName:"Template 5",
//   IsSelected  :false
// }
//   );
    }

    getTemplates()
    {
      this.templateService.getTemplates().then((response)=>{
        this.templates = response;
      }).catch((ex) => {
          this.notificationService.showNotification("Error occurred while getting templates");
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