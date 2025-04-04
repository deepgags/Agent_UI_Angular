import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertyModel } from '../../../models/PropertyModel';
import { RequestPropertyModel } from '../../../models/RequestPropertyModel';
import { PropertyService } from '../../../services/property.service';
import { SearchComponent } from '../search/search.component';
import { Title } from '@angular/platform-browser';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';
import { stringiFy } from '../../../consts/Utility';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule, SearchComponent, RouterModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements OnInit {
  propertiesList: PropertyModel[] = [];
  pageEvent: PageEvent | undefined;
  pageIndex:number;
  pageSize:number;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  loading$ = this.loadingSubject.asObservable();
 
  selectedFilters: any = {
    location: '',
    propertyType: '',
    storyType: '',
    beds: '0',
    baths: '0',
    minPrice: '',
    maxPrice: '',
    propertyStatus: '',
    sqFt: '',
  };
 
  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    public loadingService: LoadingService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private titleService : Title,
    private router: Router
  ) {
    this.titleService.setTitle("Search Properties");
    this.pageIndex = 0;
    this.pageSize = 10;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.selectedFilters = {
          ...this.selectedFilters,
          ...params
        };
        this.searchProperties(params);
      }
    });
  }

  dummyData():void
  {
    const property = new PropertyModel()
    property.TotalRecords = 11;
    property.ListingKey="0001"
    property.TransactionType="For Sale"
    property.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
    property.StreetName = "Street Name";
    property.BedroomsTotal="4"
    property.BathroomsTotalInteger="2"
    property.BuildingAreaTotal=2
    property.BuildingAreaUnits="Unit 1"
    property.ListPrice="$ 90,678"
    property.Media = [{ 
      Media_status: "",
      Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
      Media_type:"",
      _id:"",
      Modification_Timestamp:""
     }];
    
    const property1 = new PropertyModel()
    property1.TotalRecords = 11;
    property1.ListingKey="0001"
    property1.TransactionType="For Sale"
    property1.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
    property1.StreetName = "Street Name";
    property1.BedroomsTotal="4"
    property1.BathroomsTotalInteger="2"
    property1.BuildingAreaTotal=2
    property1.BuildingAreaUnits="Unit 1"
    property1.ListPrice="$ 90,678"
    property1.Media = [{ 
      Media_status: "",
      Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
      Media_type:"",
      _id:"",
      Modification_Timestamp:""
     }];
  
     const property2 = new PropertyModel()
     property2.TotalRecords = 11;
     property2.ListingKey="0001"
     property2.TransactionType="For Sale"
     property2.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
     property2.StreetName = "Street Name";
     property2.BedroomsTotal="4"
     property2.BathroomsTotalInteger="2"
     property2.BuildingAreaTotal=2
     property2.BuildingAreaUnits="Unit 1"
     property2.ListPrice="$ 90,678"
     property2.Media = [{ 
      Media_status: "",
      Media_url: 'https://trreb-image.ampre.ca/DXctZtFKCXPpGmjNtKZGLgYth60tIT7wAOxh_jBRe1o/rs:fit:960:960/wm:.5:so:0:50:.4/wmsh:10/wmt:PHNwYW4gZm9yZWdyb3VuZD0nd2hpdGUnIGZvbnQ9JzY4Jz5DQlJFIExJTUlURUQsIEJyb2tlcmFnZTwvc3Bhbj4/cb:20240610223448/L3RycmViL2xpc3RpbmdzLzMwLzEzLzYwLzk2L3AvNzRjOTc4ZDctYTdlMi00MWFhLWI3NGItMWI2MWM1ZmExOGQ5LmpwZw.jpg',
      Media_type:"",
      _id:"",
      Modification_Timestamp:""
     }];
  
     const property3 = new PropertyModel()
     property3.TotalRecords = 11;
     property3.ListingKey="0001"
     property3.TransactionType="For Sale"
     property3.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
     property3.StreetName = "Street Name";
     property3.BedroomsTotal="4"
     property3.BathroomsTotalInteger="2"
     property3.BuildingAreaTotal=2
     property3.BuildingAreaUnits="Unit 1"
     property3.ListPrice="$ 90,678"
    property3.Media = [{ 
      Media_status: "",
      Media_url: 'https://trreb-image.ampre.ca/NI-A7hpPWjwAcYs_5jJIC3qvTK6wSnq47DWqnbga2xc/rs:fit:240:240/wm:.5:so:0:50:.4/wmsh:10/wmt:PHNwYW4gZm9yZWdyb3VuZD0nd2hpdGUnIGZvbnQ9JzY4Jz5DQlJFIExJTUlURUQsIEJyb2tlcmFnZTwvc3Bhbj4/cb:20240610223449/L3RycmViL2xpc3RpbmdzLzMwLzEzLzYwLzk2L3AvNjZjMTQxNjctYjFjZi00N2E2LThlODktZjY1MjBiMzI0Mzk2LmpwZw.jpg',
      Media_type:"",
      _id:"",
      Modification_Timestamp:""
     }];
     const property4 = new PropertyModel()
     property4.TotalRecords = 11;
     property4.ListingKey="0001"
     property4.TransactionType="For Sale"
     property4.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
     property4.StreetName = "Street Name";
     property4.BedroomsTotal="4"
     property4.BathroomsTotalInteger="2"
     property4.BuildingAreaTotal=2
     property4.BuildingAreaUnits="Unit 1"
     property4.ListPrice="$ 90,678"
     property4.Media = [{ 
       Media_status: "",
       Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
       Media_type:"",
       _id:"",
       Modification_Timestamp:""
      }];
      const property5 = new PropertyModel()
      property5.TotalRecords = 11;
      property5.ListingKey="0001"
      property5.TransactionType="For Sale"
      property5.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
      property5.StreetName = "Street Name";
      property5.BedroomsTotal="4"
      property5.BathroomsTotalInteger="2"
      property5.BuildingAreaTotal=2
      property5.BuildingAreaUnits="Unit 1"
      property5.ListPrice="$ 90,678"
      property5.Media = [{ 
        Media_status: "",
        Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
        Media_type:"",
        _id:"",
        Modification_Timestamp:""
       }];
       const property6 = new PropertyModel()
       property6.TotalRecords = 11;
       property6.ListingKey="0001"
       property6.TransactionType="For Sale"
       property6.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
       property6.StreetName = "Street Name";
       property6.BedroomsTotal="4"
       property6.BathroomsTotalInteger="2"
       property6.BuildingAreaTotal=2
       property6.BuildingAreaUnits="Unit 1"
       property6.ListPrice="$ 90,678"
       property6.Media = [{ 
         Media_status: "",
         Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
         Media_type:"",
         _id:"",
         Modification_Timestamp:""
        }];
        const property7 = new PropertyModel()
        property7.TotalRecords = 11;
        property7.ListingKey="0001"
        property7.TransactionType="For Sale"
        property7.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
        property7.StreetName = "Street Name";
        property7.BedroomsTotal="4"
        property7.BathroomsTotalInteger="2"
        property7.BuildingAreaTotal=2
        property7.BuildingAreaUnits="Unit 1"
        property7.ListPrice="$ 90,678"
        property7.Media = [{ 
          Media_status: "",
          Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
          Media_type:"",
          _id:"",
          Modification_Timestamp:""
         }];
         const property8 = new PropertyModel()
         property8.TotalRecords = 11;
         property8.ListingKey="0001"
         property8.TransactionType="For Sale"
         property8.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
         property8.StreetName = "Street Name";
         property8.BedroomsTotal="4"
         property8.BathroomsTotalInteger="2"
         property8.BuildingAreaTotal=2
         property8.BuildingAreaUnits="Unit 1"
         property8.ListPrice="$ 90,678"
         property8.Media = [{ 
           Media_status: "",
           Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
           Media_type:"",
           _id:"",
           Modification_Timestamp:""
          }];
          const property9 = new PropertyModel()
          property9.TotalRecords = 11;
          property9.ListingKey="0001"
          property9.TransactionType="For Sale"
          property9.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
          property9.StreetName = "Street Name";
          property9.BedroomsTotal="4"
          property9.BathroomsTotalInteger="2"
          property9.BuildingAreaTotal=2
          property9.BuildingAreaUnits="Unit 1"
          property9.ListPrice="$ 90,678"
          property9.Media = [{ 
            Media_status: "",
            Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
            Media_type:"",
            _id:"",
            Modification_Timestamp:""
           }];
           const property10 = new PropertyModel()
           property10.TotalRecords = 11;
           property10.ListingKey="0001"
           property10.TransactionType="For Sale"
           property10.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
           property10.StreetName = "Street Name";
           property10.BedroomsTotal="4"
           property10.BathroomsTotalInteger="2"
           property10.BuildingAreaTotal=2
           property10.BuildingAreaUnits="Unit 1"
           property10.ListPrice="$ 90,678"
           property10.Media = [{ 
             Media_status: "",
             Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
             Media_type:"",
             _id:"",
             Modification_Timestamp:""
            }];
            const property11 = new PropertyModel()
            property11.TotalRecords = 11;
            property11.ListingKey="0001"
            property11.TransactionType="For Sale"
            property11.UnparsedAddress = "234, CHD, India Bulidng area Quarck";
            property11.StreetName = "Street Name";
            property11.BedroomsTotal="4"
            property11.BathroomsTotalInteger="2"
            property11.BuildingAreaTotal=2
            property11.BuildingAreaUnits="Unit 1"
            property11.ListPrice="$ 90,678"
            property11.Media = [{ 
              Media_status: "",
              Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
              Media_type:"",
              _id:"",
              Modification_Timestamp:""
             }];
  
     this.propertiesList.push(property);
     this.propertiesList.push(property1);
     this.propertiesList.push(property2);
     this.propertiesList.push(property3);
     this.propertiesList.push(property4);
     this.propertiesList.push(property5);
     this.propertiesList.push(property6);
     this.propertiesList.push(property7);
     this.propertiesList.push(property8);
     this.propertiesList.push(property9);
     this.propertiesList.push(property10);
     this.propertiesList.push(property11);
  }

  selectProperty(propertyId:string, mlsId:string):void{
    const userInfo = this.storageService.getLoggedUserFromUserInfo();
    if(userInfo.templateId == "0b69c6031f111d63bc2c975dd2837e38")
    {
      this.router.navigate(['/t1/propertydetail'], {
        queryParams: {
          propertyId,
          mlsId
        }
      });
    }
    if(userInfo.templateId == "0b69c6031f111d63bc2c975dd2837e39")
    {
      this.router.navigate(['/t2/propertydetail'], {
        queryParams: {
          propertyId,
          mlsId
        }
      });
    }
   
  }

   searchProperties = (selectedFilters: any, event?:PageEvent) => {
    this.pageIndex = event?.pageIndex ?? this.pageIndex;
    this.pageSize = event?.pageSize ?? this.pageSize;

    const params = {
      page: this.pageIndex,
      pageSize: this.pageSize,
      address: stringiFy(selectedFilters.address),
      property_type: stringiFy(selectedFilters.propertyType),
      property_subtype: stringiFy(selectedFilters.propertySubtype),
      bedrooms: stringiFy(selectedFilters.bedrooms),
      bathrooms: stringiFy(selectedFilters.bathrooms),
      property_for: stringiFy(selectedFilters.propertyFor),
      min_price: stringiFy(selectedFilters.minPrice),
      max_price: stringiFy(selectedFilters.maxPrice),
      min_area: stringiFy(selectedFilters.minArea),
    }
//  this.dummyData();
    this.loadingService.loadingOn();
    this.loadingSubject.next(true);
    this.propertyService.searchProperties(params).subscribe({
      next: (response) => {
        this.propertiesList = response;
      },
      error: (err) => {
        this.notificationService.showNotification("Error occurred while getting properties");
      },
      complete: () => {
        this.loadingSubject.next(false);
       // this.loadingService.loadingOff();
      }
    })
   return event;
  }
}
