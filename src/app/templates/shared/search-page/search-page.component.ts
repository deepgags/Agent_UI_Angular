import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PropertyModel } from '../../../models/PropertyModel';
import { RequestPropertyModel } from '../../../models/RequestPropertyModel';
import { PropertyService } from '../../../services/property.service';
import { SearchComponent } from '../search/search.component';
import { Title } from '@angular/platform-browser';
import { LoadingService } from '../../../services/loading.service';
import { NotificationService } from '../../../services/notification.service';
import { stringiFy } from '../../../consts/Utility';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'

@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule, SearchComponent, RouterModule, MatPaginatorModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchPageComponent implements OnInit {
  propertiesList: PropertyModel[] = [];

  pageEvent: PageEvent | undefined;
  pageIndex:number;
  pageSize:number;
  // length:number;
 
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
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private titleService : Title
  ) {
    this.titleService.setTitle("Search Properties");
    this.pageIndex = 1;
    this.pageSize = 2;
    // this.length = 11;
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
    //property.PageIndex = 1;
    //property.PageSize = 5;
    property.Media = [{ 
      Media_status: "",
      Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
      Media_type:"",
      _id:"",
      Modification_Timestamp:""
     }];
    
    const property1 = new PropertyModel()
    property1.TotalRecords = 11;
    property1.Media = [{ 
      Media_status: "",
      Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
      Media_type:"",
      _id:"",
      Modification_Timestamp:""
     }];
  
     const property2 = new PropertyModel()
     property2.TotalRecords = 11;
     property2.Media = [{ 
      Media_status: "",
      Media_url: 'https://trreb-image.ampre.ca/DXctZtFKCXPpGmjNtKZGLgYth60tIT7wAOxh_jBRe1o/rs:fit:960:960/wm:.5:so:0:50:.4/wmsh:10/wmt:PHNwYW4gZm9yZWdyb3VuZD0nd2hpdGUnIGZvbnQ9JzY4Jz5DQlJFIExJTUlURUQsIEJyb2tlcmFnZTwvc3Bhbj4/cb:20240610223448/L3RycmViL2xpc3RpbmdzLzMwLzEzLzYwLzk2L3AvNzRjOTc4ZDctYTdlMi00MWFhLWI3NGItMWI2MWM1ZmExOGQ5LmpwZw.jpg',
      Media_type:"",
      _id:"",
      Modification_Timestamp:""
     }];
  
     const property3 = new PropertyModel()
     property3.TotalRecords = 11;
    property3.Media = [{ 
      Media_status: "",
      Media_url: 'https://trreb-image.ampre.ca/NI-A7hpPWjwAcYs_5jJIC3qvTK6wSnq47DWqnbga2xc/rs:fit:240:240/wm:.5:so:0:50:.4/wmsh:10/wmt:PHNwYW4gZm9yZWdyb3VuZD0nd2hpdGUnIGZvbnQ9JzY4Jz5DQlJFIExJTUlURUQsIEJyb2tlcmFnZTwvc3Bhbj4/cb:20240610223449/L3RycmViL2xpc3RpbmdzLzMwLzEzLzYwLzk2L3AvNjZjMTQxNjctYjFjZi00N2E2LThlODktZjY1MjBiMzI0Mzk2LmpwZw.jpg',
      Media_type:"",
      _id:"",
      Modification_Timestamp:""
     }];
     const property4 = new PropertyModel()
     property4.TotalRecords = 11;
     property4.Media = [{ 
       Media_status: "",
       Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
       Media_type:"",
       _id:"",
       Modification_Timestamp:""
      }];
      const property5 = new PropertyModel()
      property5.TotalRecords = 11;
      property5.Media = [{ 
        Media_status: "",
        Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
        Media_type:"",
        _id:"",
        Modification_Timestamp:""
       }];
       const property6 = new PropertyModel()
       property6.TotalRecords = 11;
       property6.Media = [{ 
         Media_status: "",
         Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
         Media_type:"",
         _id:"",
         Modification_Timestamp:""
        }];
        const property7 = new PropertyModel()
        property7.TotalRecords = 11;
        property7.Media = [{ 
          Media_status: "",
          Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
          Media_type:"",
          _id:"",
          Modification_Timestamp:""
         }];
         const property8 = new PropertyModel()
         property8.TotalRecords = 11;
         property8.Media = [{ 
           Media_status: "",
           Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
           Media_type:"",
           _id:"",
           Modification_Timestamp:""
          }];
          const property9 = new PropertyModel()
          property9.TotalRecords = 11;
          property9.Media = [{ 
            Media_status: "",
            Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
            Media_type:"",
            _id:"",
            Modification_Timestamp:""
           }];
           const property10 = new PropertyModel()
           property10.TotalRecords = 11;
           property10.Media = [{ 
             Media_status: "",
             Media_url: 'https://trreb-image.ampre.ca/0kPWsdz3NqiiNM9q6iBG-CS9zr5Ns8G_9kqA6a0n6cs/rs:fit:3840:3840/bG9jYWw6Ly8vRlVMTC8xLzM5MS9XMzUwMjM5MS5qcGc.jpg',
             Media_type:"",
             _id:"",
             Modification_Timestamp:""
            }];
            const property11 = new PropertyModel()
            property11.TotalRecords = 11;
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

  searchProperties = (selectedFilters: any, event?:PageEvent) => {
    // const { location, propertyType, storyType, beds, baths, minPrice, maxPrice, propertyStatus, sqFt } = selectedFilters;
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
 this.dummyData();
    // this.loadingService.loadingOn();
    // this.propertyService.searchProperties(params).subscribe({
    //   next: (response) => {
    //     this.propertiesList = response;
    //     // this.pageIndex = response[0].PageIndex;
    //     // this.pageSize = response[0].PageSize;
    //     this.length = response[0].TotalRecords;
    //   },
    //   error: (err) => {
    //     this.notificationService.showNotification("Error occurred while getting properties");
    //   },
    //   complete: () => {this.loadingService.loadingOff();}
    // })
   return event;
  }
}
