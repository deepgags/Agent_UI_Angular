import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule} from '@angular/material/select';
import { ImageCropperComponent } from 'ngx-smart-cropper';
import { CustomerModel } from '../../models/CustomerModel';
import { Router } from '@angular/router';
import { SharedDataService } from '../../services/shareddata.service';
import { BrokerageTypeService } from '../../services/brokerage.service';
import { BrokerageTypeModel } from '../../models/BrokerageTypeModel';
import { NotificationService } from '../../services/notification.service';
import { Title } from '@angular/platform-browser';
import { LoadingService } from '../../services/loading.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RoleModel } from '../../models/RoleModel';

@Component({
  selector: 'app-register',
  imports: [CommonModule, AngularSvgIconModule, FormsModule, ReactiveFormsModule, MatDialogModule,
     MatFormFieldModule, MatInputModule, MatSelectModule, ImageCropperComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {

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
    private brokerageTypeService: BrokerageTypeService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private titleService : Title,
    private sharedDataService: SharedDataService) {
      this.titleService.setTitle("Register")
    }

    ngOnInit() {
      
      this.customerForm = this.fb.group({
        businessName: new FormControl(this.customerModel.businessName, Validators.required),
        brokerageType: new FormControl("", Validators.required),
        firstName: new FormControl(this.customerModel.firstName, Validators.required),
        lastName: new FormControl(this.customerModel.lastName, Validators.required),
        phoneNumber: new FormControl(this.customerModel.phoneNumber),//, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
        cellNumber: new FormControl(this.customerModel.cellNumber,[Validators.required, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
        emailAddress: new FormControl(this.customerModel.emailAddress, [Validators.required, Validators.email]),
        address: new FormControl(this.customerModel.address),
        password: new FormControl(this.customerModel.password, [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')]),
        confirmPassword: new FormControl(this.customerModel.confirmPassword, Validators.required),
        logoImage: new FormControl(this.customerModel.logoImage),
        logoImagePath: new FormControl(this.customerModel.logoImagePath),
        profileImage: new FormControl(this.customerModel.profileImage),
        profileImagePath: new FormControl(this.customerModel.profileImagePath),
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
            this.customerModel.password = data.password;
            this.customerModel.confirmPassword = data.confirmPassword;
          }
        });

        this.getBrokerageTypes();
    }

    getBrokerageTypes()
    {
      this.loadingService.loadingOn();
      this.brokerageTypeService.getBrokerageTypes().subscribe({
        next: (response) => {
          this.brokerageTypes = response;
        },
        error: () => {
          this.notificationService.showNotification("Error occurred while getting brokerage types");
        },
        complete: () => {this.loadingService.loadingOff();}
      })
    }

    brokerageChange(selectedBrokerage:any):void{
      this.logoImagePath = selectedBrokerage.LogoPath;
      this.showSVG = selectedBrokerage.isSVGLogo();
    }

    save() {
      const {valid} = this.customerForm;
      if (valid)
      {
        this.customerModel.profileImage = this.profileImageSource;
        this.customerModel.logoImage = this.logoImageSource;
        this.customerModel.logoImagePath = this.logoImagePath;
        this.router.navigateByUrl('/template');
        this.sharedDataService.changeData(this.customerModel);
      }
  }

  redirectToLogin()
  {
    this.router.navigateByUrl('login');
  }
}