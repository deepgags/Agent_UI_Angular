import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { PropertyModel } from '../models/PropertyModel';
import { RequestPropertyModel } from '../models/RequestPropertyModel';
import { catchError, map, Observable, throwError } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {
  query = signal<string>("");
  private Apiurl:string = "";

  constructor(private http: HttpClient, private storageService: StorageService,) {
    this.Apiurl = environment.propertyApiUrl + environment.propertySearchUrl;
  }

  searchProperties(propertyParams:any): Observable<PropertyModel[]> {
    const alternateNames = this.storageService.getLoggedUserFromUserInfo().brokerage?.AlternateName;
    const officesName = alternateNames?.split(',');
    const { page, pageSize, address, property_type, property_subtype, bedrooms, bathrooms, property_for, min_price, max_price, sqFt, brokerageType } = propertyParams;
    return this.http.get<PropertyModel[]>(`${this.Apiurl}?page=${page}&pageSize=${pageSize}&address=${address}
      &property_type=${property_type}&property_subtype=${property_subtype}&bedrooms=${bedrooms}
      &bathrooms=${bathrooms}&property_for=${property_for}&min_price=${min_price}
      &max_price=${max_price}&min_area=${sqFt}&brokerageType=${brokerageType}`)
          .pipe(map((result: any) => {
            if(result && result.data && result.data.length > 0)
            {
              return result.data.map((property:any)=>
              {
                return {
                  _id: property._id,
                  BuildingName: property.BuildingName,
                  BathroomsTotalInteger: property.BathroomsTotalInteger,
                  BedroomsTotal: property.BedroomsTotal,
                  BrokerFaxNumber: property.BrokerFaxNumber,
                  BusinessName: property.BusinessName,
                  City: property.City,
                  CityRegion: property.CityRegion,
                  Country: property.Country,
                  CountyOrParish: property.CountyOrParish,
                  CrossStreet: property.CrossStreet,
                  Latitude: property.Latitude,
                  ListingKey: property.ListingKey,
                  ListPrice: property.ListPrice,
                  ListPriceUnit: property.ListPriceUnit,
                  Longitude: property.Longitude,
                  LotSizeDimensions: property.LotSizeDimensions,
                  OriginalListPrice: property.OriginalListPrice,
                  PrivateRemarks: property.PrivateRemarks,
                  PropertySubType: property.PropertySubType,
                  PropertyType: property.PropertyType,
                  PropertyUse: property.PropertyUse,
                  PublicRemarks: property.PublicRemarks,
                  StreetName: property.StreetName,
                  StreetNumber: property.StreetNumber,
                  StreetSuffix: property.StreetSuffix,
                  Town: property.Town,
                  TransactionType: property.TransactionType,
                  UnitNumber: property.UnitNumber,
                  UnparsedAddress: property.UnparsedAddress,
                  Media: property.Media.filter((x:any)=>x.Media_type && x.Media_status=="Active" && x.Media_category 
                  && x.Media_category.includes('Photo') && x.ImageSize_description
                  && (x.ImageSize_description == 'LargestNoWatermark' || x.ImageSize_description == 'Large')),
                  BuildingAreaTotal: property.BuildingAreaTotal,
                  BuildingAreaUnits: property.BuildingAreaUnits,
                  TotalRecords: result.total,
                  ListOfficeName: property.ListOfficeName,
                  ListingContractDate: property.ListingContractDate,
                  IsFeatureListing : property.ListOfficeName && officesName?.some(x=> property.ListOfficeName.toLowerCase().includes(x))
              }});
            }
            return [];
          }),
          catchError(error => {
            return throwError(() => error);
          }));
    }

  getProperty(propertId:any, mlsId:any): Observable<PropertyModel> {
    const officesName = this.storageService.getLoggedUserFromUserInfo().brokerage?.AlternateName.split(',');
      return this.http.get<PropertyModel>(`${environment.propertyApiUrl}/propertyinformation?id=${propertId}&mlsId=${mlsId}`)
            .pipe(map((result: any) => {
              if(result && result.data)
              {
                const property = result.data;
                const propertyModel: PropertyModel =
                   {
                    _id: property._id,                    
                    BuildingName: property.BuildingName,
                    BathroomsTotalInteger: property.BathroomsTotalInteger,
                    BedroomsTotal: property.BedroomsTotal,
                    BrokerFaxNumber: property.BrokerFaxNumber,
                    BusinessName: property.BusinessName,
                    City: property.City,
                    CityRegion: property.CityRegion,
                    Country: property.Country,
                    CountyOrParish: property.CountyOrParish,
                    CrossStreet: property.CrossStreet,
                    Latitude: property.Latitude,
                    ListingKey: property.ListingKey,
                    ListPrice: property.ListPrice,
                    ListPriceUnit: property.ListPriceUnit,
                    Longitude: property.Longitude,
                    LotSizeDimensions: property.LotSizeDimensions,
                    OriginalListPrice: property.OriginalListPrice,
                    PrivateRemarks: property.PrivateRemarks,
                    PropertySubType: property.PropertySubType,
                    PropertyType: property.PropertyType,
                    PropertyUse: property.PropertyUse,
                    PublicRemarks: property.PublicRemarks,
                    StreetName: property.StreetName,
                    StreetNumber: property.StreetNumber,
                    StreetSuffix: property.StreetSuffix,
                    Town: property.Town,
                    TransactionType: property.TransactionType,
                    UnitNumber: property.UnitNumber,
                    UnparsedAddress: property.UnparsedAddress,
                    Media: property.Media.filter((x:any)=>x.Media_type && x.Media_status=="Active" && x.Media_category 
                    && x.Media_category.includes('Photo') && x.ImageSize_description
                    && (x.ImageSize_description =='LargestNoWatermark' || x.ImageSize_description == 'Large')),
                    BuildingAreaTotal: property.BuildingAreaTotal,
                    BuildingAreaUnits: property.BuildingAreaUnits,
                    TotalRecords: result.total,
                    ListOfficeName: property.ListOfficeName,
                    PublicRemarksExtra: property.PublicRemarksExtra,
                    ListingContractDate: property.ListingContractDate,
                    PurchaseContractDate: property.PurchaseContractDate,
                    TaxLegalDescription: property.TaxLegalDescription,
                    IsFeatureListing : property.ListOfficeName && officesName?.includes(property.ListOfficeName)
                   }
                return propertyModel;
              }
              return {} as PropertyModel
            }),
            catchError(error => {
              return throwError(() => error);
            }));
    }

}