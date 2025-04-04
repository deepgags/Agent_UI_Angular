import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCarouselConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PropertyModel } from '../../../models/PropertyModel';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import {MatButtonModule} from '@angular/material/button';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-propertydetail',
  imports: [CommonModule, NgbModule, MatButtonModule],
  providers: [NgbCarouselConfig],
  templateUrl: './propertydetail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./propertydetail.component.scss'],
  standalone: true
})
export class PropertydetailComponent implements OnInit {

  property: PropertyModel;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  selectedFilters: any = {
    propertyId: '',
    mlsId: ''
  };

  constructor(private route: ActivatedRoute,
    private propertyService: PropertyService,
     private notificationService: NotificationService,
  ) {
    this.property = new PropertyModel(); 
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
  }

  getPropertyInformation():void
  {
    this.loadingSubject.next(true);
    this.propertyService.getProperty(this.selectedFilters.propertyId, this.selectedFilters.mlsId).subscribe({
      next: (response) => {
        this.property = response;
      },
      error: (err) => {
        this.notificationService.showNotification("Error occurred while getting property information");
      },
      complete: () => {
        this.loadingSubject.next(false);
      }
    })
  }

}
