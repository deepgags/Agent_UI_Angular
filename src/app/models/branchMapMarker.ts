import { PropertyModel } from "./PropertyModel";

export interface BranchMapMarker {
    property: PropertyModel;
    position: {
      lat: number;
      lng: number;
    };
    title: string;
    options: {
      animation: google.maps.Animation;
    };
    label: string;
    click?: () => void;
  }