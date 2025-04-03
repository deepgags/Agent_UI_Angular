export class PropertyModel{
    TotalRecords: number | 0
    // PageIndex: number | 0 
    // PageSize: number | 0 
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
    ListingKey: string | "" | undefined
    Longitude: number | undefined
    Media: Array<MediaModel> | [] | undefined
    PropertySubType: string | "" | undefined
    PropertyType: string | "" | undefined
    _id: string | "" | undefined
    BuildingAreaTotal?: number
    BuildingAreaUnits?: string

    constructor() {
        // this.PageIndex = 1;
        // this.PageSize = 10;
        this.TotalRecords = 10;
    }
}

export type MediaModel = {
    Media_status: string | "",
    Media_type: string | "",
    Media_url: string | "",
    Modification_Timestamp: string | "",
    _id: string | "",
  }