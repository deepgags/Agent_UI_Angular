import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerModel } from '../../models/CustomerModel';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import { CustomerService } from '../../services/customer.service';
import {Router} from "@angular/router"
import { stopCoverage } from 'v8';
import { StorageService } from '../../services/storage.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  @Input() saveButtonText = "Login"

  loginForm!: FormGroup;
  customerModel: CustomerModel = new CustomerModel();

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: {name: string},
    private fb: FormBuilder,
    // private dialog: MatDialog,
    private customerService: CustomerService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private router: Router) {
      
    }
    
    ngOnInit() {
      var userInfo = this.storageService.getLoggedUserFromUserInfo();
      if(userInfo.CustomerId!="")
      {
        this.router.navigateByUrl("home");
      }
    
      this.loginForm = this.fb.group({
        emailAddress: new FormControl(this.customerModel.EmailAddress, [Validators.required, Validators.email]),
        password: new FormControl(this.customerModel.Password, Validators.required),
      });
    
      this.loginForm.valueChanges.subscribe(
        (data) => {
          if (JSON.stringify(data) !== JSON.stringify({})) {
            this.customerModel.EmailAddress = data.emailAddress;
            this.customerModel.Password = data.password;
          }
        });  
    }
    
    login() {
      const {value, valid} = this.loginForm;
      if (valid)
      {
        this.customerService.login(this.customerModel)
        .subscribe(
          (response) => {         
            this.storageService.saveToken(response.token);
            this.storageService.saveUserInfo(JSON.stringify(response.data));      
            this.notificationService.showNotification("User login successfully.")
            this.router.navigateByUrl("home");
          },
          (error) => {
            this.notificationService.showNotification("Invalid username/password")
          }
        )
     } 
  }
}