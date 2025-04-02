import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomerModel } from '../../../models/CustomerModel';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Title } from '@angular/platform-browser';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-templatesite',
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './templatesite.component.html',
  styleUrl: './templatesite.component.scss'
})
export class TemplatesiteComponent implements OnInit {

  templateForm!: FormGroup;
  readonly dialogRef = inject(MatDialogRef<TemplatesiteComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public customerData : CustomerModel,
  private fb: FormBuilder,
  private router : Router,
  private customerService: CustomerService,
  private titleService : Title,
  private loadingService: LoadingService,
  private notificationService: NotificationService) {
    this.titleService.setTitle("Site Url")
  }

  ngOnInit(): void {
    this.templateForm = this.fb.group({
      siteUrl: new FormControl("", [Validators.required]),
    });

    this.templateForm.valueChanges.subscribe(
      (data) => {
        if (JSON.stringify(data) !== JSON.stringify({})) {
            this.customerData.siteUrl = data.siteUrl;
        }
      });  
  }

  close(){
    this.dialogRef.close();
    this.titleService.setTitle("Templates")
  }

  save()
  {
    const {valid} = this.templateForm;
    if (valid)
    {
        this.customerData.roleId = '0b69c6031f111d63bc2c975dd2837e20';
        this.loadingService.loadingOn();
        this.customerService.save(this.customerData).subscribe({
          next: (v) =>  {},
          error: (e) => 
            {
              this.loadingService.loadingOff();
              this.notificationService.showNotification('Something went wrong while saving information.');
            },
          complete: () => {
            this.dialogRef.close();
            this.loadingService.loadingOff();
            this.router.navigateByUrl("thanks")
          }
     })  
     
    }
  }

}
