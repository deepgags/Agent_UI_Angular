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
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterestedUserModel } from '../../../models/InterestedUserModel';
import { InterestedUserService } from '../../../services/interestedUser.service';
import { Title } from '@angular/platform-browser';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

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
  // @ViewChild(GoogleMap) googleMap: GoogleMap;

  // branches = signal<Branch[]>([]);
  center: google.maps.LatLngLiteral = { lat: 46.8182, lng: 8.2275 }; // Center of Switzerland
  zoom = 80;
  // markers: BranchMapMarker[] = [];
  // selectedBranch = signal<Branch | null>(null);

  selectedFilters: any = {
    propertyId: '',
    mlsId: ''
  };

  constructor(private route: ActivatedRoute,
     private propertyService: PropertyService,
     private interestdUserService: InterestedUserService,
     private notificationService: NotificationService,
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

    this.userForm = this.fb.group({
      firstName: new FormControl(this.userModel.firstName, Validators.required),
      phoneNumber: new FormControl(this.userModel.phoneNumber, [Validators.required, Validators.pattern('^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$')]),
      emailAddress: new FormControl(this.userModel.emailAddress, [Validators.required, Validators.email]),
      comment: new FormControl("I would like more information regarding a property", Validators.required),
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

  openInfoWindow( property:PropertyModel, marker: MapMarker): void {
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
      },
      error: (err) => {
        this.notificationService.showNotification("Error occurred while getting property information");
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
      this.userModel.latitude = this.Latitude;
      this.userModel.longitude = this.Longitude
      this.userModel.propertyId = this.selectedFilters.propertyId;
      this.userModel.mlsId = this.selectedFilters.mlsId;

      this.loadingSubject.next(true);
      this.interestdUserService.save(this.userModel).subscribe({
        next: (v) =>  {},
         error: (e) => 
          {
            this.notificationService.showNotification('Something went wrong while saving information');
          },
        complete: () => {
          this.notificationService.showNotification('Information has been saved');
          this.loadingSubject.next(false);
          this.userModel = new InterestedUserModel();
          this.userForm.reset();
        }
     })  
   }
  }

}