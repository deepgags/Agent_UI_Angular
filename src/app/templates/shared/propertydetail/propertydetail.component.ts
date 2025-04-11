import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PropertyModel } from '../../../models/PropertyModel';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { MatButtonModule} from '@angular/material/button';
import { NotificationService } from '../../../services/notification.service';
import { SearchComponent } from '../search/search.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterestedUserModel } from '../../../models/InterestedUserModel';
import { InterestedUserService } from '../../../services/interestedUser.service';
import { Title } from '@angular/platform-browser';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-propertydetail',
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, MatDialogModule, SearchComponent,
    MatFormFieldModule, MatInputModule,
    GoogleMapsModule,
    RouterModule],
  providers: [NgbCarouselConfig],
  templateUrl: './propertydetail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./propertydetail.component.scss'],
  standalone: true
})
export class PropertydetailComponent implements OnInit {

  property: PropertyModel;
  Latitude: number= 0;
  Longitude: number= 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  userForm!: FormGroup;
  userModel: InterestedUserModel = new InterestedUserModel();

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  zoom = 14;
  center: google.maps.LatLngLiteral = { lat: 56.1304, lng: 106.3468 }; // Center of Cananda

  selectedFilters: any = {
    propertyId: '',
    mlsId: ''
  };

  constructor(     
     private route: ActivatedRoute,
     private propertyService: PropertyService,
     private interestdUserService: InterestedUserService,
     private notificationService: NotificationService,
     private storageService: StorageService,
     private titleService : Title,
     private location: Location,
     private router: Router,
     private fb: FormBuilder
  ) {
    this.property = new PropertyModel(); 
    this.titleService.setTitle("Property Detail")
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.selectedFilters = {
          ...this.selectedFilters,
          ...params
        };
        this.getPropertyInformation();
      }
    });

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

  openInfoWindow(property : PropertyModel, marker: MapMarker): void {
    if (this.infoWindow) {
      this.infoWindow.open(marker);
    }
  }

  getPropertyInformation():void
  {
    this.loadingSubject.next(true);
    this.propertyService.getProperty(this.selectedFilters.propertyId, this.selectedFilters.mlsId).subscribe({
      next: (response) => {
        this.property = response;
         this.center.lat = this.property.Latitude;
         this.center.lng = this.property.Longitude;
        const parser = new DOMParser();
        // this is an SVG string of a house icon, but feel free to use whatever SVG icon you'd like
        const svgString = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF5733" stroke="#FFFFFF" viewBox="0 0 24 24">
                          <path fill-rule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clip-rule="evenodd"/>
                          </svg>`;
      },
      error: (err) => {
        this.notificationService.showNotification("Error occurred while getting property information");
        this.loadingSubject.next(false);
      },
      complete: () => {
        this.loadingSubject.next(false);
      }
    })
  }

  back() {
    this.location.back();
  }

  searchProperties = (selectedFilters: any) => {
    const { address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt } = selectedFilters;
    this.router.navigate(['/t2', 'search'], {
      queryParams: {
        address, property_type, bedrooms, bathrooms, min_price, max_price, property_status, sqFt
      }
    });
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

  save() {
    const {valid} = this.userForm;
    if (valid)
    {
      const userInfo = this.storageService.getLoggedUserFromUserInfo();
      this.userModel.latitude = this.Latitude;
      this.userModel.longitude = this.Longitude
      this.userModel.propertyId = this.selectedFilters.propertyId;
      this.userModel.mlsId = this.selectedFilters.mlsId;
      this.userModel.customerId = userInfo.customerId;
      this.userModel.templateId = userInfo.templateId;

      this.loadingSubject.next(true);
      this.interestdUserService.save(this.userModel).subscribe({
        next: (v) =>  {},
         error: (e) => 
          {
            this.notificationService.showNotification('Something went wrong while saving information');
          },
        complete: () => {
          this.storageService.saveUserInfo(JSON.stringify(this.userModel) , "InterestedUser");
          this.notificationService.showNotification('Information has been saved');
          this.loadingSubject.next(false);
          this.userModel = new InterestedUserModel();
          this.userForm.reset();
        }
     })  
   }
  }

}