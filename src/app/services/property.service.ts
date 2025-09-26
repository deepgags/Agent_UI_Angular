import { HttpClient } from "@angular/common/http";
import { DOCUMENT, Inject, Injectable, signal } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "../environments/environment.development";
import { PropertyModel } from "../models/PropertyModel";

@Injectable({
	providedIn: "root",
})
export class PropertyService {
	query = signal<string>("");
	private Apiurl: string = environment.baseUrl;

	constructor(
		private http: HttpClient,
		@Inject(DOCUMENT) private document: Document,
	) { }

	searchProperties(propertyParams: any): Observable<PropertyModel[]> {
		const hostname = this.document.location.hostname;
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
				`${this.Apiurl}/properties?page=${page}&pageSize=${pageSize}&address=${address}
      &property_type=${encodeURIComponent(property_type)}&property_subtype=${encodeURIComponent(property_subtype)}&bedrooms=${bedrooms}
      &bathrooms=${bathrooms}&property_for=${property_for}&min_price=${min_price}
      &max_price=${max_price}&min_area=${sqFt}&brokerageType=${brokerageType ? brokerageType : ""}&sort=${sort}&domain=${hostname}`
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
								CityRegion: property.CityRegion,
								// Country: property.Country,
								// CountyOrParish: property.CountyOrParish,
								CrossStreet: property.CrossStreet,
								Latitude: property.Latitude,
								ListingKey: property.ListingKey,
								ListPrice: property.ListPrice,
								ListPriceUnit: property.ListPriceUnit,
								Longitude: property.Longitude,
								Directions: property.Directions,
								WaterYN: property.WwaterYN,
								HeatType: property.HeatType,
								GarageType: property.GarageType,
								GarageYN: property.GarageYN,
								DaysOnMarket: property.DaysOnMarket,
								ArchitecturalStyle: property.ArchitecturalStyle,
								HeatSource: property.HeatSource,
								LotSizeDimensions: property.LotSizeDimensions,
								OriginalListPrice: property.OriginalListPrice,

								PropertySubType: property.PropertySubType,
								PropertyType: property.PropertyType,
								// PropertyUse: property.PropertyUse,
								PublicRemarks: property.PublicRemarks,
								PublicRemarksExtra: property.PublicRemarksExtra,
								TaxLegalDescription: property.TaxLegalDescription,
								// StreetName: property.StreetName,
								// StreetNumber: property.StreetNumber,
								BuildingAreaTotal: property.BuildingAreaTotal,

								Town: property.Town,
								TransactionType: property.TransactionType,
								UnitNumber: property.UnitNumber,
								UnparsedAddress: property.UnparsedAddress,
								Media: property.Media,

								BuildingAreaUnits: property.BuildingAreaUnits,
								TotalRecords: result.total,
								ListOfficeName: property.ListOfficeName,
								ListingContractDate: property.ListingContractDate,
								IsFeatureListing: false,
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

	featuredProperties(propertyParams: any): Observable<PropertyModel[]> {
		const hostname = this.document.location.hostname;
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
			siteId
		} = propertyParams;

		return this.http
			.get<PropertyModel[]>(
				`${this.Apiurl}/properties/featured?page=${page}&pageSize=${pageSize}&address=${address}
      &property_type=${encodeURIComponent(property_type)}&property_subtype=${encodeURIComponent(property_subtype)}&bedrooms=${bedrooms}
      &bathrooms=${bathrooms}&property_for=${property_for}&min_price=${min_price}
      &max_price=${max_price}&min_area=${sqFt}&brokerageType=${brokerageType ? brokerageType : ""}&sort=${sort}&domain=${hostname}`
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
								CityRegion: property.CityRegion,
								// Country: property.Country,
								// CountyOrParish: property.CountyOrParish,
								CrossStreet: property.CrossStreet,
								Latitude: property.Latitude,
								ListingKey: property.ListingKey,
								ListPrice: property.ListPrice,
								ListPriceUnit: property.ListPriceUnit,
								Longitude: property.Longitude,
								Directions: property.Directions,
								WaterYN: property.WwaterYN,
								HeatType: property.HeatType,
								GarageType: property.GarageType,
								GarageYN: property.GarageYN,
								DaysOnMarket: property.DaysOnMarket,
								ArchitecturalStyle: property.ArchitecturalStyle,
								HeatSource: property.HeatSource,
								LotSizeDimensions: property.LotSizeDimensions,
								OriginalListPrice: property.OriginalListPrice,

								PropertySubType: property.PropertySubType,
								PropertyType: property.PropertyType,
								// PropertyUse: property.PropertyUse,
								PublicRemarks: property.PublicRemarks,
								PublicRemarksExtra: property.PublicRemarksExtra,
								TaxLegalDescription: property.TaxLegalDescription,
								// StreetName: property.StreetName,
								// StreetNumber: property.StreetNumber,
								BuildingAreaTotal: property.BuildingAreaTotal,

								Town: property.Town,
								TransactionType: property.TransactionType,
								UnitNumber: property.UnitNumber,
								UnparsedAddress: property.UnparsedAddress,
								Media: property.Media,

								BuildingAreaUnits: property.BuildingAreaUnits,
								TotalRecords: result.total,
								ListOfficeName: property.ListOfficeName,
								ListingContractDate: property.ListingContractDate,
								IsFeatureListing: false,
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
		return this.http.get<PropertyModel>(`${environment.baseUrl}/properties/propertyinformation?id=${propertId}&mlsId=${mlsId}`).pipe(
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
						PropertyType: property.PropertyType,
						PropertySubType: property.PropertySubType,
						CrossStreet: property.CrossStreet,
						HeatSource: property.HeatSource,
						HeatType: property.HeatType,
						RentalItems: property.RentalItems,
						SewerYNA: property.SewerYNA,
						Exclusions: property.Exclusions,
						DaysOnMarket: property.DaysOnMarket,
						Water: property.Water,
						Basement: property.Basement,
						ArchitecturalStyle: property.ArchitecturalStyle,
						GarageType: property.GarageType,
						GarageYN: property.GarageYN,
						TelephoneYNA: property.TelephoneYNA,
						ListAOR: property.ListAOR,
						TaxLegalDescription: property.TaxLegalDescription,
						VirtualTourURLUnbranded: property.VirtualTourURLUnbranded,
						MlsStatus: property.MlsStatus,
						OccupantType: property.OccupantType,
						Latitude: property.Latitude,
						RentIncludes: property.RentIncludes,
						ListingKey: property.ListingKey,
						ListPrice: property.ListPrice,
						ListPriceUnit: property.ListPriceUnit,
						Longitude: property.Longitude,
						// LotSizeDimensions: property.LotSizeDimensions,
						// OriginalListPrice: property.OriginalListPrice,

						PublicRemarksExtra: property.PublicRemarksExtra,

						PropertyUse: property.PropertyUse,
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
						PurchaseContractDate: property.PurchaseContractDate,

						IsFeatureListing: false,
						ModificationTimestamp: property.ModificationTimestamp,
						PropertyFeedType: property.PropertyFeedType
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
		return this.http.get(`${environment.baseUrl}/properties/property-types`).pipe(
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

	getRoomDetails(mlsId: string, propertyFeedType: string): Observable<any> {
		return this.http.get(`${environment.baseUrl}/properties/room-details/${mlsId}/${propertyFeedType}`).pipe(
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
		return this.http.post(`${environment.baseUrl}/properties/similar`, params).pipe(
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
