import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailPageComponent } from './property-detail-page.component';

describe('PropertyDetailPageComponent', () => {
  let component: PropertyDetailPageComponent;
  let fixture: ComponentFixture<PropertyDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
