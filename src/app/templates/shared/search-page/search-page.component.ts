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
import {MatIconModule} from '@angular/material/icon';
import { HighlightSearch } from '../../../Pipes/highlight';
import { MatDialog } from '@angular/material/dialog';
import { InteresteduserComponent } from '../../../components/dialogs/interested-user/interested-user.component';

@Component({
  selector: 'app-search-page',
  imports: [FormsModule, CommonModule, MatIconModule, SearchComponent, RouterModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class SearchPageComponent implements OnInit {
  propertiesList: PropertyModel[] | undefined;
  pageEvent: PageEvent | undefined;
  pageIndex:number = 1;
  pageSize:number = 12;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
 
  selectedFilters: any = {
    address: '',
    property_type: '',
    bedrooms: '0',
    bathrooms: '0',
    min_price: '',
    max_price: '',
    property_status: '',
    sqFt: '',
  };
 
  constructor(
    private _interestedUserDialog: MatDialog,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    public loadingService: LoadingService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private titleService : Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.titleService.setTitle("Search Properties");
  }

  ngOnInit(): void {
    this.pageIndex = 1;
    this.pageSize = 12;
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

  openDialog(property : PropertyModel) {
         const userDialog = this._interestedUserDialog.open(InteresteduserComponent,
             {
                width      : '50%',
                height     : 'auto',
                disableClose : true,
                autoFocus : false,
                restoreFocus : false,
                hasBackdrop: true,
                data       :  property
             }
          )

          userDialog.afterClosed().subscribe(result => {
            if(result)
            {
               this.redirectToDetail(property);
            }
          });
        }

  selectProperty(property : PropertyModel) : void{
    if(property.IsFeatureListing)
    {
       this.openDialog(property);
    }
    else
    {
        this.redirectToDetail(property);
    }
  }

  redirectToDetail(property : PropertyModel): void
  {
    const userInfo = this.storageService.getLoggedUserFromUserInfo();
    const propertyUrl = userInfo.templateId == "0b69c6031f111d63bc2c975dd2837e38" ? '/t1/propertydetail' : '/t2/propertydetail';
    this.router.navigate(
      [propertyUrl], 
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          address: this.selectedFilters['address'], 
          property_type: this.selectedFilters['property_type'],
          bedrooms: this.selectedFilters['bedrooms'],
          bathrooms: this.selectedFilters['bathrooms'], 
          min_price: this.selectedFilters['min_price'], 
          max_price: this.selectedFilters['max_price'], 
          property_status: this.selectedFilters['property_status'], 
          sqFt: this.selectedFilters['sqFt'],
          propertyId: property._id,
          mlsId: property.ListingKey
        },
        queryParamsHandling: 'replace'
      }
    );  
  }

  searchProperties = (selectedFilters: any, event?:PageEvent) => {
    this.pageIndex = event?event.pageIndex + 1: this.pageIndex;
    this.pageSize = event?.pageSize ?? this.pageSize;

    const params = {
      page: this.pageIndex,
      pageSize: this.pageSize,
      address: stringiFy(selectedFilters.address),
      property_type: stringiFy(selectedFilters.property_type),
      property_subtype: stringiFy(selectedFilters.property_subtype),
      bedrooms: stringiFy(selectedFilters.bedrooms),
      bathrooms: stringiFy(selectedFilters.bathrooms),
      property_for: stringiFy(selectedFilters.property_status),
      min_price: stringiFy(selectedFilters.min_price),
      max_price: stringiFy(selectedFilters.max_price),
      sqFt: stringiFy(selectedFilters.sqFt),
    }

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
      }
    })
   return event;
  }
}