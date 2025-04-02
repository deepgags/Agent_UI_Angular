import { HttpClient } from '@angular/common/http';
import { inject, Injectable, resource, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { PropertyModel } from '../models/PropertyModel';
import { RequestPropertyModel } from '../models/RequestPropertyModel';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {
  private properties: PropertyModel[] = [];
  query = signal<string>("");
  private Apiurl:string ="";

 constructor(private http: HttpClient) {
    this.Apiurl = environment.propertyApiUrl + environment.propertySearchUrl;
  }

  async getProperties(name:string, pageNo=1, pageSize=5): Promise<PropertyModel[]> {
    this.http.get<any>(this.Apiurl + '?page=' + pageNo + '&pageSize=' + pageSize)
        .subscribe(data =>
            {
                data.data.forEach((property: any) => {
                    this.properties.push({
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
                        ListingKey:property.ListingKey,
                        ListPrice:property.ListPrice,
                        Longitude:property.Longitude,
                        LotSizeDimensions:property.LotSizeDimensions,
                        OriginalListPrice:property.OriginalListPrice,
                        PrivateRemarks:property.PrivateRemarks,
                        PropertySubType:property.PropertySubType,
                        PropertyType:property.PropertyType,
                        PropertyUse:property.PropertyUse,
                        PublicRemarks:property.PublicRemarks,
                        StreetName:property.StreetName,
                        StreetNumber:property.StreetNumber,
                        StreetSuffix:property.StreetSuffix,
                        Town:property.Town,
                        UnitNumber:property.UnitNumber,
                        UnparsedAddress:property.UnparsedAddress,
                        Media:property.Media,
                    });
                });
            });

     return this.properties;
  }

  searchProperties(propertyParams: RequestPropertyModel, pageNo = 1, pageSize = 20) {
      const { page, page_size, address, property_type, property_subtype, bedrooms, bathrooms, property_for, min_price, max_price, min_area } = propertyParams;

       let url = `${this.Apiurl}?page=${page}&pageSize=${page_size}`;

      if (address) {
        url += `&address=${address}`;
      }
      if (property_type) {
        url += `&property_type=${property_type}`;
      }
      if (property_subtype) {
        url += `&property_subtype=${property_subtype}`;
      }
      if (bedrooms) {
        url += `&bedrooms=${bedrooms}`;
      }
      if (bathrooms) {
        url += `&bathrooms=${bathrooms}`;
      }
      if (property_for) {
        url += `&property_for=${property_for}`;
      }
      if (min_price) {
        url += `&min_price=${min_price}`;
      }
      if (max_price) {
        url += `&max_price=${max_price}`;
      }
      if (min_area) {
        url += `&min_area=${min_area}`;
      }

      return this.http.get<any>(url);

  }

}