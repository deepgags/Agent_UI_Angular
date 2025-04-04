export class PropertyModel{
    TotalRecords: number | 0
    BrokerFaxNumber: string | "" | undefined
    BusinessName: string | "" | undefined
    UnparsedAddress: string | "" | undefined
    PublicRemarks: string | "" | undefined
    PrivateRemarks: string | "" | undefined
    ListPrice: string | "" | undefined
    OriginalListPrice: string | "" | undefined
    LotSizeDimensions: string | "" | undefined
    UnitNumber: string | "" | undefined
    TransactionType: string | "" | undefined
    CrossStreet: string | "" | undefined
    StreetSuffix: string | "" | undefined
    StreetNumber: string | "" | undefined
    PropertyUse: string | "" | undefined
    StreetName: string | "" | undefined
    Town: string | "" | undefined
    City: string | "" | undefined
    Country: string | "" | undefined
    CountyOrParish: string | "" | undefined
    CityRegion: string | "" | undefined
    BuildingName: string | "" | undefined
    BathroomsTotalInteger: any
    BedroomsTotal: any
    Latitude: number | undefined
    ListingKey: string | ""
    Longitude: number | undefined
    Media: Array<MediaModel> | [] | undefined
    PropertySubType: string | "" | undefined
    PropertyType: string | "" | undefined
    _id: string | "" 
    BuildingAreaTotal?: number
    BuildingAreaUnits?: string
    ListOfficeName?: string
    ListingContractDate?: string
    PublicRemarksExtra?: string
    PurchaseContractDate?: string
    TaxLegalDescription?: string

    constructor() {
        this.TotalRecords = 10;
        this._id = "";
        this.ListingKey = "";
    }
}

export type MediaModel = {
    Media_status: string | "",
    Media_type: string | "",
    Media_url: string | "",
    Modification_Timestamp: string | "",
    _id: string | "",
  }