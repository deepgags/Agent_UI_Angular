import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InterestedUserService } from '../../../services/interestedUser.service';
import { Title } from '@angular/platform-browser';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';
import { InterestedUserModel } from '../../../models/InterestedUserModel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StorageService } from '../../../services/storage.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PropertyModel } from '../../../models/PropertyModel';

@Component({
  selector: 'app-interesteduser',
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './interested-user.component.html',
  styleUrl: './interested-user.component.scss'
})
export class InteresteduserComponent implements OnInit {

  userForm!: FormGroup;
  userModel: InterestedUserModel = new InterestedUserModel();
  readonly dialogRef = inject(MatDialogRef<InteresteduserComponent>);

  Latitude: number = 0;
  Longitude: number = 0;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(@Inject(MAT_DIALOG_DATA) public userData : PropertyModel,
    private fb: FormBuilder,
    private interestedUserService: InterestedUserService,
    private storageService: StorageService,
    private notificationService: NotificationService) {
  
}

ngOnInit(): void {
  const interestedUserInfo = this.storageService.getInterestedUser();
  this.userForm = this.fb.group({
    firstName: new FormControl(interestedUserInfo.firstName, Validators.required),
    phoneNumber: new FormControl(interestedUserInfo.phoneNumber, [Validators.required, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
    emailAddress: new FormControl(interestedUserInfo.emailAddress, [Validators.required, Validators.email]),
    comment: new FormControl(interestedUserInfo.comment ? interestedUserInfo.comment : "I would like more information regarding a property", Validators.required),
  });

  this.userForm.valueChanges.subscribe(
    (data) => {
      if (JSON.stringify(data) !== JSON.stringify({})) {
        this.userModel.firstName = data.firstName;
        this.userModel.phoneNumber = data.phoneNumber;
        this.userModel.emailAddress = data.emailAddress;
        this.userModel.comment = data.comment;
      }
    });

  this.getLocation();
}

close(){
  this.dialogRef.close();
}

save() {
  const {valid} = this.userForm;
  if (valid)
  {
      const userInfo = this.storageService.getLoggedUserFromUserInfo();
      this.userModel.latitude = this.Latitude;
      this.userModel.longitude = this.Longitude;
      this.userModel.propertyId = this.userData._id;
      this.userModel.mlsId = this.userData.ListingKey;
      this.userModel.customerId = userInfo.customerId;
      this.userModel.templateId = userInfo.templateId;

      this.storageService.saveUserInfo(JSON.stringify(this.userModel) , "InterestedUser");
      this.close();

  //   this.loadingSubject.next(true);
  //   this.interestedUserService.save(this.userModel).subscribe({
  //     next: (v) =>  {},
  //      error: (e) => 
  //       {
  //         this.notificationService.showNotification('Something went wrong while saving information');
  //       },
  //     complete: () => {
  //       this.notificationService.showNotification('Information has been saved');
  //       this.loadingSubject.next(false);
  //       this.userForm.reset();
  //       this.close();
  //     }
  //  })  
 }
}

getLocation(): void{
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.Latitude = latitude; 
        this.Longitude = longitude;
        console.log("Long: " + longitude + " Lat: " + latitude);
      });
  } else {
     console.log("No support for geolocation")
  }
}

}