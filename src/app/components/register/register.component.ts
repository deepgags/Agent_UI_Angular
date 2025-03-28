import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ImageCropperComponent } from 'ngx-smart-cropper';
import { CustomerModel } from '../../models/CustomerModel';
import { CustomerService } from '../../services/customer.service';
import { NotificationService } from '../../services/notification.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {

  @Input() saveButtonText = "Next"

  customerForm!: FormGroup;
  customerModel: CustomerModel = new CustomerModel();

  profileCroppedImage = '';//'/images/NoLogo.png';
  profileImageSource: string = '';
  logoCroppedImage = '';//'/images/NoLogo.png';
  logoImageSource: string = '';


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if(input?.id=="profileImageUpload")
        {
        this.profileImageSource = e.target.result;
         //this.profileCroppedImage = e.target.result;
        }
        else{
          this.logoImageSource = e.target.result;
        //this.logoCroppedImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  profileImageCropped(event: any) {
    this.profileCroppedImage = event;
  }
  logoImageCropped(event: any) {
    this.profileCroppedImage = event;
  }

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: {name: string},
    private fb: FormBuilder,
    // private dialog: MatDialog,
    private customerService: CustomerService,
    private notificationService: NotificationService) {

    }

    ngOnInit() {

      this.customerForm = this.fb.group({
        businessName: new FormControl(this.customerModel.BusinessName, Validators.required),
        firstName: new FormControl(this.customerModel.FirstName, Validators.required),
        lastName: new FormControl(this.customerModel.LastName, Validators.required),
        phoneNumber: new FormControl(this.customerModel.PhoneNumber, [Validators.required]),//, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
        emailAddress: new FormControl(this.customerModel.EmailAddress, [Validators.required, Validators.email]),
        address: new FormControl(this.customerModel.Address, Validators.required),
        password: new FormControl(this.customerModel.Password, Validators.required),
        confirmPassword: new FormControl(this.customerModel.ConfirmPassword, Validators.required),
        logoImage: new FormControl(this.customerModel.LogoImage),
        logoImagePath: new FormControl(this.customerModel.LogoImagePath),
        profileImage: new FormControl(this.customerModel.ProfileImage),
        profileImagePath: new FormControl(this.customerModel.ProfileImagePath),
      });

      this.customerForm.valueChanges.subscribe(
        (data) => {
          if (JSON.stringify(data) !== JSON.stringify({})) {
            this.customerModel.BusinessName = data.businessName;
            this.customerModel.FirstName = data.firstName;
            this.customerModel.LastName = data.lastName;
            this.customerModel.PhoneNumber = data.phoneNumber;
            this.customerModel.EmailAddress = data.emailAddress;
            this.customerModel.Address = data.address;
            this.customerModel.Password = data.password;
            this.customerModel.ConfirmPassword = data.confirmPassword;
            this.customerModel.LogoImage = data.logoImage;
            this.customerModel.LogoImagePath = data.logoImagePath;
            this.customerModel.ProfileImage = this.profileImageSource;//data.profileImage;
            this.customerModel.ProfileImagePath = data.profileImagePath;
          }
        });
    }

    save() {
      const {value, valid} = this.customerForm;
      debugger;
      if (valid)
      {
        this.customerService.save(this.customerModel).then((response)=>
        {
          this.notificationService.showNotification(response.Message)
        });
     }
  }
}