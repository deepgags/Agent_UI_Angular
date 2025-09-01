export class PropertyModel {
	TotalRecords: number | 0;
	BrokerFaxNumber?: string | "" | undefined;
	BusinessName?: string;
	UnparsedAddress: string;
	PublicRemarks?: string | "" | undefined;
	PrivateRemarks?: string | "" | undefined;
	ListPrice: string | "" | undefined;
	ListPriceUnit: string | "" | undefined;
	OriginalListPrice?: string | "" | undefined;
	LotSizeDimensions?: string | "" | undefined;
	UnitNumber?: string | "" | undefined;
	TransactionType?: string | "" | undefined;
	CrossStreet?: string;
	RentalItems?: string;
	SewerYNA?:string;
	Exclusions?:string;
	DaysOnMarket?:string;
	Water?:string;
	Basement?:string[];
	ArchitecturalStyle?:string[];
	GarageType?:string;
	GarageYN?:string;
	HeatSource?:string;
	HeatType?:string;
	TelephoneYNA?:string;
	ListAOR?:string;
	RentIncludes?:[];
	TaxLegalDescription?:string;
	VirtualTourURLUnbranded?:string;
	MlsStatus?:string;
	OccupantType?:string;
	StreetSuffix?: string | "" | undefined;
	StreetNumber?: string | "" | undefined;
	PropertyUse: string;
	StreetName?: string | "" | undefined;
	Town?: string | "" | undefined;
	City?: string | "" | undefined;
	Country?: string | "" | undefined;
	CountyOrParish?: string | "" | undefined;
	CityRegion?: string | "" | undefined;
	BuildingName?: string;
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
	Directions?: string;
	ListOfficeName: string;
	ModificationTimestamp: string | any;
	ListingContractDate?: string;
	PublicRemarksExtra?: string;
	PurchaseContractDate?: string;
	 
	IsFeatureListing: boolean = false;

	constructor() {
		this.TotalRecords = 10;
		this._id = "";
		this.ListingKey = "";
		this.Latitude = 0;
		this.Longitude = 0;
		this.BusinessName = "";
		this.BuildingName = "";
		 
		this.ListOfficeName = "";
		this.PropertyUse = "";
		this.UnparsedAddress = "";
		this.ModificationTimestamp = "";

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
