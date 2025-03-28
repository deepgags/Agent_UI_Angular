export class PropertyModel{
    BrokerFaxNumber: string | "" | undefined
    BusinessName: string | "" | undefined
    UnparsedAddress: string | "" | undefined
    PublicRemarks: string | "" | undefined
    PrivateRemarks: string | "" | undefined
    ListPrice: string | "" | undefined
    OriginalListPrice: string | "" | undefined
    LotSizeDimensions: string | "" | undefined
    UnitNumber: string | "" | undefined
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
}

export type MediaModel = {
    Media_status: "",
    Media_type: "",
    Media_url: "",
    Modification_Timestamp: "",
    _id: "",
  }