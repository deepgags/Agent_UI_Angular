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
  private notificationService: NotificationService) {

  }

  ngOnInit(): void {
   
    this.templateForm = this.fb.group({
      siteUrl: new FormControl("", Validators.required),
    });

    this.templateForm.valueChanges.subscribe(
      (data) => {
        if (JSON.stringify(data) !== JSON.stringify({})) {
            this.customerData.siteUrl = data.siteUrl;
        }
      });  
  }

  save()
  {
    const {valid} = this.templateForm;
    if (valid)
    {
        this.customerData.roleId = '0b69c6031f111d63bc2c975dd2837e20';
        this.customerService.save(this.customerData).subscribe({
          next: (v) =>  console.log(v),
          error: (e) => 
            {
              console.error(e)
              this.notificationService.showNotification('Something went wrong while saving information.');
            },
          complete: () => {
            this.dialogRef.close();
            this.router.navigateByUrl("thanks")
          }
     })  
     
    }
  }

}
