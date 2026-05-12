export interface Property {
  // Identity
  _id: string;
  ListingKey?: string;
  MlsStatus?: string;
  StandardStatus?: string;
  ContractStatus?: string;

  // Address
  UnparsedAddress?: string;
  StreetNumber?: string;
  StreetName?: string;
  StreetSuffix?: string;
  City?: string;
  CityRegion?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  Country?: string;
  CountyOrParish?: string;

  // Pricing
  ListPrice?: number;
  OriginalListPrice?: number;
  ListingContractDate?: string;
  ExpirationDate?: string;
  PossessionDate?: string;
  PossessionType?: string;

  // Property Details
  PropertyType?: string;
  PropertySubType?: string;
  BedroomsTotal?: number;
  BedroomsAboveGrade?: number;
  BedroomsBelowGrade?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  YearBuilt?: number;
  ApproximateAge?: string;

  // Lot
  LotWidth?: number;
  LotDepth?: number;
  LotSizeArea?: number;
  LotSizeUnits?: string;

  // Garage/Parking
  GarageType?: string;
  GarageYN?: boolean;
  ParkingTotal?: number;
  ParkingFeatures?: string[];

  // Features
  HeatType?: string;
  HeatSource?: string;
  Cooling?: string[];
  FireplaceYN?: boolean;
  Basement?: string[];
  FoundationDetails?: string[];
  Roof?: string[];
  ConstructionMaterials?: string[];
  ExteriorFeatures?: string[];

  // Financial
  TaxAnnualAmount?: number;
  TaxYear?: number;
  TaxLegalDescription?: string;

  // Description
  PublicRemarks?: string;
  Exclusions?: string;
  Inclusions?: string;
  PrivateRemarks?: string;

  // Location
  Latitude?: number;
  Longitude?: number;

  // Media
  Media?: any[];
  MediaCount?: number;

  // Metadata
  ListOfficeName?: string;
  ListAOR?: string;
  ModificationTimestamp?: string;
}
