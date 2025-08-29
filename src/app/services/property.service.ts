import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../environments/environment.development";
import { PropertyModel } from "../models/PropertyModel";

@Injectable({
	providedIn: "root",
})
export class PropertyService {
	query = signal<string>("");
	private Apiurl: string = `${environment.propertyApiUrl}`;

	constructor(private http: HttpClient) {}

	searchProperties(propertyParams: any): Observable<PropertyModel[]> {
		const alternateNames = "";
		const officesName = alternateNames?.split(",");
		const {
			page,
			pageSize,
			address,
			property_type,
			property_subtype,
			bedrooms,
			bathrooms,
			property_for,
			min_price,
			max_price,
			sqFt,
			brokerageType,
			sort,
		} = propertyParams;

		return this.http
			.get<PropertyModel[]>(
				`${this.Apiurl}?page=${page}&pageSize=${pageSize}&address=${address}
      &property_type=${property_type}&property_subtype=${property_subtype}&bedrooms=${bedrooms}
      &bathrooms=${bathrooms}&property_for=${property_for}&min_price=${min_price}
      &max_price=${max_price}&min_area=${sqFt}&brokerageType=${brokerageType ? brokerageType : ""}&sort=${sort}`
			)
			.pipe(
				map((result: any) => {
					if (result && result.data && result.data.length > 0) {
						return result.data.map((property: any) => {
							return {
								_id: property._id,
								// BuildingName: property.BuildingName,
								BathroomsTotalInteger: property.BathroomsTotalInteger,
								BedroomsTotal: property.BedroomsTotal,
								BrokerFaxNumber: property.BrokerFaxNumber,
								BusinessName: property.BusinessName,
								City: property.City,
								// CityRegion: property.CityRegion,
								// Country: property.Country,
								// CountyOrParish: property.CountyOrParish,
								// CrossStreet: property.CrossStreet,
								Latitude: property.Latitude,
								ListingKey: property.ListingKey,
								ListPrice: property.ListPrice,
								ListPriceUnit: property.ListPriceUnit,
								Longitude: property.Longitude,
								LotSizeDimensions: property.LotSizeDimensions,
								OriginalListPrice: property.OriginalListPrice,
								// PrivateRemarks: property.PrivateRemarks,
								PropertySubType: property.PropertySubType,
								PropertyType: property.PropertyType,
								// PropertyUse: property.PropertyUse,
								PublicRemarks: property.PublicRemarks,
								// StreetName: property.StreetName,
								// StreetNumber: property.StreetNumber,
								// StreetSuffix: property.StreetSuffix,
								Town: property.Town,
								TransactionType: property.TransactionType,
								UnitNumber: property.UnitNumber,
								UnparsedAddress: property.UnparsedAddress,
								Media: property.Media,
								BuildingAreaTotal: property.BuildingAreaTotal,
								BuildingAreaUnits: property.BuildingAreaUnits,
								TotalRecords: result.total,
								ListOfficeName: property.ListOfficeName,
								ListingContractDate: property.ListingContractDate,
								IsFeatureListing:
									property.ListOfficeName && property.ListOfficeName.toLowerCase().indexOf("homelife") > -1
										? true
										: false,
								ModificationTimestamp: property.ModificationTimestamp,
							};
						});
					}
					return [];
				}),
				catchError((error) => {
					return throwError(() => error);
				})
			);
	}

	getPropertyDetails(propertId: any, mlsId: any): Observable<PropertyModel> {
		const officesName = "";
		return this.http.get<PropertyModel>(`${environment.propertyApiUrl}/propertyinformation?id=${propertId}&mlsId=${mlsId}`).pipe(
			map((result: any) => {
				if (result && result.data) {
					const property = result.data;
					const propertyModel: PropertyModel = {
						_id: property._id,
						// BuildingName: property.BuildingName,
						BathroomsTotalInteger: property.BathroomsTotalInteger,
						BedroomsTotal: property.BedroomsTotal,
						// BrokerFaxNumber: property.BrokerFaxNumber,
						// BusinessName: property.BusinessName,
						City: property.City,
						// CityRegion: property.CityRegion,
						// Country: property.Country,
						// CountyOrParish: property.CountyOrParish,
						// CrossStreet: property.CrossStreet,
						Latitude: property.Latitude,
						ListingKey: property.ListingKey,
						ListPrice: property.ListPrice,
						ListPriceUnit: property.ListPriceUnit,
						Longitude: property.Longitude,
						// LotSizeDimensions: property.LotSizeDimensions,
						// OriginalListPrice: property.OriginalListPrice,
						// PrivateRemarks: property.PrivateRemarks,
						PropertySubType: property.PropertySubType,
						PropertyType: property.PropertyType,
						PropertyUse: property.PropertyUse,
						// PublicRemarks: property.PublicRemarks,
						// StreetName: property.StreetName,
						// StreetNumber: property.StreetNumber,
						// StreetSuffix: property.StreetSuffix,
						Town: property.Town,
						TransactionType: property.TransactionType,
						UnitNumber: property.UnitNumber,
						UnparsedAddress: property.UnparsedAddress,
						Media: property.Media,
						BuildingAreaTotal: property.BuildingAreaTotal,
						BuildingAreaUnits: property.BuildingAreaUnits,
						TotalRecords: result.total,
						ListOfficeName: property.ListOfficeName,
						PublicRemarksExtra: property.PublicRemarksExtra,
						ListingContractDate: property.ListingContractDate,
						PurchaseContractDate: property.PurchaseContractDate,
						TaxLegalDescription: property.TaxLegalDescription,
						IsFeatureListing: property.ListOfficeName && officesName?.includes(property.ListOfficeName),
						ModificationTimestamp: property.ModificationTimestamp,
					};
					return propertyModel;
				}
				return {} as PropertyModel;
			}),
			catchError((error) => {
				return throwError(() => error);
			})
		);
	}

	getPropertyTypes(): Observable<any> {
		return this.http.get(`${environment.propertyApiUrl}/property-types`).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return {};
			}),
			catchError((error) => {
				return throwError(() => error);
			})
		);
	}

	getRoomDetails(mlsId: string): Observable<any> {
		return this.http.get(`${environment.propertyApiUrl}/room-details/${mlsId}`).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return {};
			}),
			catchError((error) => {
				return throwError(() => error);
			})
		);
	}

	getSimilarProperties(params: any): Observable<any> {
		return this.http.post(`${environment.propertyApiUrl}/similar`, params).pipe(
			map((result: any) => {
				if (result && result.data) {
					return result.data;
				}
				return {};
			}),
			catchError((error) => {
				return throwError(() => error);
			})
		);
	}
}
