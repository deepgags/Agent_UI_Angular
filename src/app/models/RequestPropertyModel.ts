export class RequestPropertyModel {
    page: number = 1;
    page_size: number = 20;
    address?: string;
    property_type?: string;
    property_subtype?: string;
    bedrooms?: string;
    bathrooms?: string;
    property_for?: string;
    min_price?: string;
    max_price?: string;
    min_area?: string;
}