import { Component, Input, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerModel } from '../../models/CustomerModel';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import {Router} from "@angular/router"
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  @Input() saveButtonText = "Login"

  loginForm!: FormGroup;
  customerModel: CustomerModel = new CustomerModel();
  public showPassword: boolean = false;
  

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
        emailAddress: new FormControl(this.customerModel.emailAddress, [Validators.required, Validators.email]),
        password: new FormControl(this.customerModel.password, Validators.required),
      });
    
      this.loginForm.valueChanges.subscribe(
        (data) => {
          if (JSON.stringify(data) !== JSON.stringify({})) {
            this.customerModel.emailAddress = data.emailAddress;
            this.customerModel.password = data.password;
          }
        });  
    }

    public togglePasswordVisibility(): void {
      this.showPassword = !this.showPassword;
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