export class PropertyModel {
	TotalRecords: number | 0;
	BrokerFaxNumber: string | "" | undefined;
	BusinessName: string;
	UnparsedAddress: string;
	PublicRemarks: string | "" | undefined;
	PrivateRemarks: string | "" | undefined;
	ListPrice: string | "" | undefined;
	ListPriceUnit: string | "" | undefined;
	OriginalListPrice: string | "" | undefined;
	LotSizeDimensions: string | "" | undefined;
	UnitNumber: string | "" | undefined;
	TransactionType: string | "" | undefined;
	CrossStreet: string;
	StreetSuffix: string | "" | undefined;
	StreetNumber: string | "" | undefined;
	PropertyUse: string;
	StreetName: string | "" | undefined;
	Town: string | "" | undefined;
	City: string | "" | undefined;
	Country: string | "" | undefined;
	CountyOrParish: string | "" | undefined;
	CityRegion: string | "" | undefined;
	BuildingName: string;
	BathroomsTotalInteger: any;
	BedroomsTotal: any;
	Latitude: number;
	ListingKey: string | "";
	Longitude: number;
	Media: any[] | MediaModel[] | undefined;
	PropertySubType: string | "" | undefined;
	PropertyType: string | "" | undefined;
	_id: string | "";
	BuildingAreaTotal?: number;
	BuildingAreaUnits?: string;
	ListOfficeName: string;
	ListingContractDate?: string;
	PublicRemarksExtra?: string;
	PurchaseContractDate?: string;
	TaxLegalDescription?: string;
	IsFeatureListing: boolean = false;

	constructor() {
		this.TotalRecords = 10;
		this._id = "";
		this.ListingKey = "";
		this.Latitude = 0;
		this.Longitude = 0;
		this.BusinessName = "";
		this.BuildingName = "";
		this.CrossStreet = "";
		this.ListOfficeName = "";
		this.PropertyUse = "";
		this.UnparsedAddress = "";
	}
}

export class MediaModel {
	Media_key: string;
	Media_status: string;
	Media_type: string;
	Media_url: string;
	Media_category: string;
	ImageSize_description: string;
	Modification_Timestamp: string;

	constructor() {
		this.Media_key = "";
		this.Media_status = "";
		this.Media_type = "";
		this.Media_url = "";
		this.Media_category = "";
		this.ImageSize_description = "";
		this.Modification_Timestamp = "";
	}
}
