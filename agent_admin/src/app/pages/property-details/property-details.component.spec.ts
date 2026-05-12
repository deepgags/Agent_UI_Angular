import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PropertyDetailsComponent } from './property-details.component';
import { ApiClientService } from '../../core/services/api-client.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

describe('PropertyDetailsComponent', () => {
  let component: PropertyDetailsComponent;
  let fixture: ComponentFixture<PropertyDetailsComponent>;
  let mockApiClient: { get: ReturnType<typeof vi.fn> };

  const mockProperty = {
    _id: '123',
    ListingKey: 'MLS123',
    UnparsedAddress: '123 Main St',
    City: 'Austin',
    StateOrProvince: 'TX',
    PostalCode: '78701',
    ListPrice: 450000,
    PropertyType: 'Single Family',
    BedroomsTotal: 3,
    BathroomsTotalInteger: 2,
    ContractStatus: 'active',
  };

  beforeEach(async () => {
    mockApiClient = {
      get: vi.fn().mockReturnValue(of(mockProperty)),
    };

    await TestBed.configureTestingModule({
      imports: [PropertyDetailsComponent, RouterTestingModule, TagModule, ButtonModule],
      providers: [
        { provide: ApiClientService, useValue: mockApiClient },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load property on init', () => {
    expect(mockApiClient.get).toHaveBeenCalledWith('/properties/123');
    expect(component.property()).toEqual(mockProperty);
  });

  it('should return correct status severity', () => {
    expect(component.getStatusSeverity('active')).toBe('success');
    expect(component.getStatusSeverity('pending')).toBe('warn');
    expect(component.getStatusSeverity('sold')).toBe('danger');
    expect(component.getStatusSeverity('withdrawn')).toBe('info');
    expect(component.getStatusSeverity(undefined)).toBe('contrast');
  });

  it('should parse list values safely', () => {
    expect(component.formatList(['A', 'B'])).toBe('A, B');
    expect(component.formatList([])).toBe('N/A');
    expect(component.formatList(undefined)).toBe('N/A');
  });
});
