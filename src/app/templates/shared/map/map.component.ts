import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from '../search/search.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PropertyModel } from '../../../models/PropertyModel';
import { BehaviorSubject } from 'rxjs';
import { PropertyService } from '../../../services/property.service';
import { LoadingService } from '../../../services/loading.service';
import { StorageService } from '../../../services/storage.service';
import { Title } from '@angular/platform-browser';
import { NotificationService } from '../../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { InteresteduserComponent } from '../../../components/dialogs/interested-user/interested-user.component';
import { stringiFy } from '../../../consts/Utility';
import { GoogleMapsModule } from '@angular/google-maps';
import { DefaultRenderer, MarkerClusterer } from "@googlemaps/markerclusterer";
import { sortTypes } from '../../../consts/DefaultTypes';

@Component({
  selector: 'app-map',
  imports: [FormsModule, CommonModule, MatIconModule, SearchComponent, RouterModule, MatPaginatorModule, MatProgressSpinnerModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MapComponent implements OnInit, AfterViewInit{

  propertiesList: PropertyModel[] | undefined;
  pageEvent: PageEvent | undefined;
  pageIndex: number = 1;
  pageSize: number = 12;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  Latitude: number= 0;
  Longitude: number= 0;
  zoom = 15;
  @ViewChild('mapComponent') mapComponent!: ElementRef<HTMLDivElement>;
  // @ViewChild('infoWindow') infoWindow!: ElementRef<MapInfoWindow>;
  previousInfoWindow: google.maps.InfoWindow | null = null;
  map!: google.maps.Map;

  markers = [{ position: { lat: 56.1304, lng: 106.3468 }, property: new PropertyModel() }] // Center of Canada

  selectedFilters: any = {
    address: '',
    property_type: '',
    bedrooms: '0',
    bathrooms: '0',
    min_price: '',
    max_price: '',
    property_status: '',
    sqFt: '',
    distance: '20',
    sort: 'Most'
  };

  sortDropDown = sortTypes;

  constructor( 
    private _interestedUserDialog: MatDialog,
    private propertyService: PropertyService,
    public loadingService: LoadingService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private titleService : Title,
    private router: Router,
    private route: ActivatedRoute) {
      this.titleService.setTitle("Properties on map");
  }

  ngAfterViewInit():void{
    this.initMap()
  }

  initMap() {
    if(this.mapComponent)
    {
      this.map = new google.maps.Map(this.mapComponent.nativeElement, {
        center: { lat: 0, lng: 0 },
        zoom: 15,
        mapTypeControl: true,
        mapId: 'properties',
        disableDefaultUI: false,
        heading: 90,
        tilt: 45,
        zoomControl: true,
        streetViewControl: false, 
        fullscreenControl: true,
        clickableIcons: true,
        gestureHandling: 'greedy',
      });
    }
  }

  ngOnInit(): void {
    this.pageIndex = 1;
    this.pageSize = 12;
    this.getLocation();
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

  async renderMarker(property : PropertyModel) {
    if(property.Latitude && property.Longitude)
    {
      const { AdvancedMarkerElement } = await (google.maps.importLibrary("marker") as unknown as { AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement });
      
      const markerELement= new AdvancedMarkerElement({
          map: this.map,
          content: this.buildContent(property),
          position:  {lat: property.Latitude, lng: property.Longitude },
          title: property.PropertyType,
          zIndex: google.maps.Marker.MAX_ZINDEX
        });
      
      markerELement.addListener("gmp-click", async () => {
        await this.openInfoWindow(markerELement, property);
     });
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

  async openInfoWindow(marker: any, property : PropertyModel) {
    if (this.previousInfoWindow) {
      this.previousInfoWindow.close();
    }

    const { InfoWindow } = await (google.maps.importLibrary("maps") as unknown as { InfoWindow: typeof google.maps.InfoWindow });
    const informationwindow = new InfoWindow({ 
      content: 
      "<div><h5>" + property.ListingKey + "</h5><p><b>Address : </b>" + property.UnparsedAddress+"<p><b>Cross Street : </b>" + property.CrossStreet +
      +"<p><b>City : </b>" + property.City + "<p><b>City : </b>" + property.City + "<p><b>Price : </b>" + property.ListPrice + "<p><b>Property Type : </b>" + property.PropertyType
      +"<p><b>Property Use : </b>" + property.TransactionType, 
      position : this.map.getCenter(), 
      disableAutoPan: true });
      informationwindow.open({map: this.map, shouldFocus: true});
      this.previousInfoWindow = informationwindow;
    //this.toggleHighlight(markerView)
  }

  // toggleHighlight(markerView:any) {
  //   if (markerView.content.classList.contains("highlight")) {
  //     markerView.content.classList.remove("highlight");
  //     markerView.zIndex = null;
  //   } else {
  //     markerView.content.classList.add("highlight");
  //     markerView.zIndex = 1;
  //   }
  // }

  getRandomColor() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
  }
  
  buildContent(property:PropertyModel) {
    
    const content = document.createElement("div");
    let propertyIcon = "home";
    switch(property.PropertyType)
    {
      case "Residential Freehold":
        propertyIcon = "home"
        break;
      case "Residential Condo & Other":
        propertyIcon = "home"
         break;
      case "Commercial":
        propertyIcon = "building"
        break;
      default:
        propertyIcon = "home"
        break;
    }
  
    content.classList.add("property");
    content.style.backgroundColor = this.getRandomColor();

    content.innerHTML = `
      <div class="icon">
          <i aria-hidden="true" class="fa fa-icon fa-${propertyIcon}" title="${property.PropertyType}"></i>
          <span class="fa-sr-only">${propertyIcon}</span>
      </div>
      <div class="details">
          <div class="price">${property.ListPrice}</div>
          <div class="address">${property.UnparsedAddress}</div>
          <div class="features">
          <div>
              <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>
              <span class="fa-sr-only">bedroom</span>
              <span>${property.BedroomsTotal}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>
              <span class="fa-sr-only">bathroom</span>
              <span>${property.BathroomsTotalInteger}</span>
          </div>
          <div>
              <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>
              <span class="fa-sr-only">size</span>
              <span>${property.BuildingAreaTotal} {property.BuildingAreaUnits} <sup>2</sup></span>
          </div>
          </div>
      </div>
      `;
    return content;
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
          relativeTo: this.route,
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

  zoomToFitMarkers(markers: { position: { lat: number; lng: number }; property: PropertyModel }[] = []): void {
      const bounds = new google.maps.LatLngBounds();
      // if(markers.length > 0)
      // {
      //   this.markers = markers;
      // }
      
      this.markers.forEach(marker => {
        bounds.extend(marker.position);
      });
      
      if (this.markers.length > 0) {
        this.map?.setCenter(bounds.getCenter())
        this.map?.fitBounds(bounds)
      }
    }
  
  searchProperties = (selectedFilters: any, event?:PageEvent) => {
      this.pageIndex = event?event.pageIndex + 1: this.pageIndex;
      this.pageSize = event?.pageSize ?? this.pageSize;

      const sort = selectedFilters.sort && selectedFilters.sort != '' ? selectedFilters.sort : "most";
  
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
        distance: stringiFy(selectedFilters.distance),
        latitude: this.Latitude,
        longitude: this.Longitude,
        sort: sort
      }
  
      this.loadingService.loadingOn();
      this.loadingSubject.next(true);
      this.propertyService.searchProperties(params).subscribe({
        next: async (response) => {
          this.propertiesList = response;
          this.markers = [];
          
          this.initMap();
          this.propertiesList.forEach(async (x)=>
          {
            this.markers.push({ position: { lat: x.Latitude, lng: x.Longitude }, property: x });
            await this.renderMarker(x);
          })
        const { AdvancedMarkerElement } = await (google.maps.importLibrary("marker") as unknown as { AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement });

        const markerClusterer = new MarkerClusterer({
          map: this.map,
          renderer: new DefaultRenderer(),
          markers: this.markers.map(x => new AdvancedMarkerElement({ position: x.position, content: this.buildContent(x.property) })),
        });

      //   markerClusterer.addListener("click", (e:any) => {
      //     const data = e;
      //     this.zoomToFitMarkers(e.markers.map((x:any) => ({ position: { lat: x.position.lat, lng: x.position.lng }, property: x.property })));
      //  });

        this.zoomToFitMarkers();
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