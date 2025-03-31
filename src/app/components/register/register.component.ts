import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { ImageCropperComponent } from 'ngx-smart-cropper';
import { CustomerModel } from '../../models/CustomerModel';
import { Router } from '@angular/router';
import { SharedDataService } from '../../services/shareddata.service';
import { BrokerageTypeService } from '../../services/brokerage.service';
import { BrokerageTypeModel } from '../../models/BrokerageTypeModel';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {

  customerForm!: FormGroup;
  customerModel: CustomerModel = new CustomerModel();
  brokerageTypes: BrokerageTypeModel[] = [];

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
    private fb: FormBuilder,
    private router: Router,
    private brokerageTypeService: BrokerageTypeService,
    private notificationService: NotificationService,
    private sharedDataService: SharedDataService) {

    }

    ngOnInit() {

      this.customerForm = this.fb.group({
        businessName: new FormControl(this.customerModel.businessName, Validators.required),
        brokerageType: new FormControl("", Validators.required),
        firstName: new FormControl(this.customerModel.firstName, Validators.required),
        lastName: new FormControl(this.customerModel.lastName, Validators.required),
        phoneNumber: new FormControl(this.customerModel.phoneNumber, [Validators.required]),//, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
        emailAddress: new FormControl(this.customerModel.emailAddress, [Validators.required, Validators.email]),
        address: new FormControl(this.customerModel.address, Validators.required),
        password: new FormControl(this.customerModel.password, Validators.required),
        confirmPassword: new FormControl(this.customerModel.confirmPassword, Validators.required),
        logoImage: new FormControl(this.customerModel.logoImage),
        logoImagePath: new FormControl(this.customerModel.logoImagePath),
        profileImage: new FormControl(this.customerModel.profileImage),
        profileImagePath: new FormControl(this.customerModel.profileImagePath),
      });

      this.customerForm.valueChanges.subscribe(
        (data) => {
          if (JSON.stringify(data) !== JSON.stringify({})) {
            this.customerModel.businessName = data.businessName;
            this.customerModel.brokerageTypeId = data.brokerageType;
            this.customerModel.firstName = data.firstName;
            this.customerModel.lastName = data.lastName;
            this.customerModel.phoneNumber = data.phoneNumber;
            this.customerModel.emailAddress = data.emailAddress;
            this.customerModel.address = data.address;
            this.customerModel.password = data.password;
            this.customerModel.confirmPassword = data.confirmPassword;
            this.customerModel.logoImage = data.logoImage;
            this.customerModel.logoImagePath = data.logoImagePath;
            this.customerModel.profileImage = this.profileImageSource;//data.profileImage;
            this.customerModel.profileImagePath = data.profileImagePath;
          }
        });

        this.getBrokerageTypes();
    }

    getBrokerageTypes()
    {
      this.brokerageTypeService.getBrokerageTypes().then((response)=>{
        this.brokerageTypes = response;
      }).catch((ex) => {
          this.notificationService.showNotification("Error occurred while getting brokerages");
      });
    }

    save() {
      const {valid} = this.customerForm;
      if (valid)
      {
        this.sharedDataService.changeData(this.customerModel);
        this.router.navigateByUrl('template');
      }
  }
}