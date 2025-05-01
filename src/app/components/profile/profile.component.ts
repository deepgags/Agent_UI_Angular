import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ImageCropperComponent } from 'ngx-smart-cropper';
import { CustomerModel } from '../../models/CustomerModel';
import { BrokerageTypeModel } from '../../models/BrokerageTypeModel';
import { Router } from '@angular/router';
import { BrokerageTypeService } from '../../services/brokerage.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';
import { Title } from '@angular/platform-browser';
import { T1HeaderComponent } from '../../templates/t1/t1-header/t1-header.component';
import { CustomerService } from '../../services/customer.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, AngularSvgIconModule, FormsModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, ImageCropperComponent, T1HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  customerForm!: FormGroup;
  customerModel: CustomerModel = new CustomerModel();
  brokerageTypes: BrokerageTypeModel[] = [];

  profileCroppedImage = '';
  profileImageSource: string = '';
  logoCroppedImage = '';
  logoImageSource: string = '';
  logoImagePath: string = '';
  showSVG: boolean = false;
  showLogo: boolean = false;

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
        }
        else{
          this.logoImageSource = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  profileImageCropped(event: any) {
    this.profileCroppedImage = event;
  }

  logoImageCropped(event: any) {
    this.logoCroppedImage = event;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customerService: CustomerService,
    private brokerageTypeService: BrokerageTypeService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private storageService: StorageService,
    private titleService : Title) {
      this.titleService.setTitle("Profile")
    }

  ngOnInit() {
    this.initForm();

    const customer = this.storageService.getLoggedUserFromUserInfo();
    
    this.customerService.getCustomer(customer?.customerId)
            .subscribe({
              next: (response) => {
                if (response && response.customerId!="") {
                  this.customerModel = response;
                  this.getBrokerageTypes();
                }
              },
              error: () => {
                this.notificationService.showNotification("An error has occurred while getting customer information")
              },
              complete:() => {
              }
          })
    }

    getBrokerageTypes()
    {
      this.loadingService.loadingOn();
      this.brokerageTypeService.getBrokerageTypes().subscribe({
        next: (response) => {
          this.brokerageTypes = response;

          const selectedBrokerage = this.brokerageTypes.find( x => x.BrokerageTypeId== this.customerModel.brokerageTypeId)

          this.logoImagePath = this.customerModel.logoImagePath;
          this.profileImageSource = this.customerModel.profileImage;
          this.customerForm.patchValue({
            businessName: this.customerModel.businessName,
            firstName: this.customerModel.firstName,
            lastName: this.customerModel.lastName,
            address: this.customerModel.address,
            emailAddress: this.customerModel.emailAddress,
            phoneNumber: this.customerModel.phoneNumber,
            cellNumber: this.customerModel.cellNumber,
            brokerageType: selectedBrokerage
        });
        this.brokerageChange(selectedBrokerage);

        },
        error: () => {
          this.notificationService.showNotification("Error occurred while getting brokerage types");
        },
        complete: () => {this.loadingService.loadingOff();}
      })
    }

    brokerageChange(selectedBrokerage:any) : void {
      this.logoImagePath = selectedBrokerage.LogoPath;
      this.showSVG = selectedBrokerage.isSVGLogo();
    }

    initForm()
    {
      this.customerForm = this.fb.group({
        businessName: new FormControl("", Validators.required),
        brokerageType: new FormControl("", Validators.required),
        firstName: new FormControl("", Validators.required),
        lastName: new FormControl("", Validators.required),
        phoneNumber: new FormControl(""),//, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
        cellNumber: new FormControl("",[Validators.required, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
        emailAddress: new FormControl("", [Validators.required, Validators.email]),
        address: new FormControl(""),
        logoImage: new FormControl(""),
        logoImagePath: new FormControl(""),
        profileImage: new FormControl(""),
        profileImagePath: new FormControl(""),
      });

      this.customerForm.valueChanges.subscribe(
        (data) => {
          if (JSON.stringify(data) !== JSON.stringify({})) {
            this.showLogo = data.brokerageType.Name == 'Other'
            this.customerModel.businessName = data.businessName;
            this.customerModel.brokerageTypeId = data.brokerageType.BrokerageTypeId;
            this.customerModel.firstName = data.firstName;
            this.customerModel.lastName = data.lastName;
            this.customerModel.cellNumber = data.cellNumber;
            this.customerModel.phoneNumber = data.phoneNumber;
            this.customerModel.emailAddress = data.emailAddress;
            this.customerModel.address = data.address;
          }
        });
    }

    save() {
    
      const {valid} = this.customerForm;
      if (valid)
      {
        this.customerModel.profileImage = this.profileImageSource;
        this.customerModel.logoImage = this.logoImageSource;
        this.customerModel.logoImagePath = this.logoImagePath;
        this.loadingService.loadingOn();
        this.customerService.update(this.customerModel).subscribe({
          next: (v) =>  {},
          error: (e) => 
            {
              this.notificationService.showNotification('Something went wrong while updating information.');
            },
          complete: () => {
            this.notificationService.showNotification("Profile updated successfully")
            this.loadingService.loadingOff();
          }
     })  
        
    }
  }

  redirectToChangePassword()
  {
    this.router.navigateByUrl('changepassword');
  }
}
