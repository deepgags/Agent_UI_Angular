import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { PropertyModel } from '../models/PropertyModel';
import { RequestPropertyModel } from '../models/RequestPropertyModel';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {
  query = signal<string>("");
  private Apiurl:string ="";

 constructor(private http: HttpClient) {
    this.Apiurl = environment.propertyApiUrl + environment.propertySearchUrl;
  }

  searchProperties(propertyParams:any): Observable<PropertyModel[]> {
    const { page, pageSize, address, property_type, property_subtype, bedrooms, bathrooms, property_for, min_price, max_price, min_area } = propertyParams;
    return this.http.get<PropertyModel[]>(`${this.Apiurl}?page=${page}&pageSize=${pageSize},&address=${address}&property_type=${property_type}&property_subtype=${property_subtype}&bedrooms=${bedrooms}&bathrooms=${bathrooms}&property_for=${property_for}&min_price=${min_price}&max_price=${max_price}&min_area=${min_area}`)
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
                  Media: property.Media.filter((x:any)=>x.Media_type && x.Media_type.includes('image')),
                  BuildingAreaTotal: property.BuildingAreaTotal,
                  BuildingAreaUnits: property.BuildingAreaUnits,
                  TotalRecords: result.total,
              }});
            }
            return [];
          }),
          catchError(error => {
            return throwError(() => error);
          }));
    }

}