import { Route } from "@angular/router";
import { AboutComponent } from "./templates/shared/about/about.component";
import { BuyerComponent } from "./templates/shared/buyer/buyer.component";
import { CalculatorComponent } from "./templates/shared/calculator/calculator.component";
import { ContactComponent } from "./templates/shared/contact/contact.component";
import { FeaturedListingsComponent } from "./templates/shared/featured-listings/featured-listings.component";
import { MapComponent } from "./templates/shared/map/map.component";
import { MortgageCalculatorComponent } from "./templates/shared/mortgage-calculator/mortgage-calculator.component";
import { PropertyDetailComponent } from "./templates/shared/propertydetail/propertydetail.component";
import { SearchPageComponent } from "./templates/shared/search-page/search-page.component";
import { SellerComponent } from "./templates/shared/seller/seller.component";
import { SellerdetailComponent } from "./templates/shared/sellerdetail/sellerdetail.component";
import { Sellerdetail2Component } from "./templates/shared/sellerdetail2/sellerdetail2.component";
import { Sellerdetail3Component } from "./templates/shared/sellerdetail3/sellerdetail3.component";
import { T1HomeComponent } from "./templates/t1/t1-home/t1-home.component";
import { T1Component } from "./templates/t1/t1.component";
import { T10HomeComponent } from "./templates/t10/t10-home/t10-home.component";
import { T10Component } from "./templates/t10/t10.component";
import { T11HomeComponent } from "./templates/t11/t11-home/t11-home.component";
import { T11Component } from "./templates/t11/t11.component";
import { T12HomeComponent } from "./templates/t12/t12-home/t12-home.component";
import { T12Component } from "./templates/t12/t12.component";
import { T13HomeComponent } from "./templates/t13/t13-home/t13-home.component";
import { T13Component } from "./templates/t13/t13.component";
import { T14HomeComponent } from "./templates/t14/t14-home/t14-home.component";
import { T14Component } from "./templates/t14/t14.component";
import { T15HomeComponent } from "./templates/t15/t15-home/t15-home.component";
import { T15Component } from "./templates/t15/t15.component";
import { T16HomeComponent } from "./templates/t16/t16-home/t16-home.component";
import { T16Component } from "./templates/t16/t16.component";
import { T17HomeComponent } from "./templates/t17/t17-home/t17-home.component";
import { T17Component } from "./templates/t17/t17.component";
import { T18HomeComponent } from "./templates/t18/t18-home/t18-home.component";
import { T18Component } from "./templates/t18/t18.component";
import { T19HomeComponent } from "./templates/t19/t19-home/t19-home.component";
import { T19Component } from "./templates/t19/t19.component";
import { T2HomeComponent } from "./templates/t2/t2-home/t2-home.component";
import { T2Component } from "./templates/t2/t2.component";
import { T3HomeComponent } from "./templates/t3/t3-home/t3-home.component";
import { T3Component } from "./templates/t3/t3.component";
import { T4HomeComponent } from "./templates/t4/t4-home/t4-home.component";
import { T4Component } from "./templates/t4/t4.component";
import { T5HomeComponent } from "./templates/t5/t5-home/t5-home.component";
import { T5Component } from "./templates/t5/t5.component";
import { T6HomeComponent } from "./templates/t6/t6-home/t6-home.component";
import { T6Component } from "./templates/t6/t6.component";
import { T7HomeComponent } from "./templates/t7/t7-home/t7-home.component";
import { T7Component } from "./templates/t7/t7.component";
import { T8HomeComponent } from "./templates/t8/t8-home/t8-home.component";
import { T8Component } from "./templates/t8/t8.component";
import { T9HomeComponent } from "./templates/t9/t9-home/t9-home.component";
import { T9Component } from "./templates/t9/t9.component";

export interface TemplateRoute {
	path: string;
	component: any;
	children: any[];
}

export interface TemplateRoutes {
	[key: string]: Route;
}

export const templates: TemplateRoutes = {
	t1: {
		path: "",
		component: T1Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T1HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t2: {
		path: "",
		component: T2Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T2HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t3: {
		path: "",
		component: T3Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T3HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t4: {
		path: "",
		component: T4Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T4HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t5: {
		path: "",
		component: T5Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T5HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t6: {
		path: "",
		component: T6Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T6HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t7: {
		path: "",
		component: T7Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T7HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t8: {
		path: "",
		component: T8Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T8HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t9: {
		path: "",
		component: T9Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T9HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t10: {
		path: "",
		component: T10Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T10HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t11: {
		path: "",
		component: T11Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T11HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t12: {
		path: "",
		component: T12Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T12HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t13: {
		path: "",
		component: T13Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T13HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t14: {
		path: "",
		component: T14Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T14HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t15: {
		path: "",
		component: T15Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T15HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t16: {
		path: "",
		component: T16Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T16HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t17: {
		path: "",
		component: T17Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T17HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t18: {
		path: "",
		component: T18Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T18HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
	t19: {
		path: "",
		component: T19Component,
		children: [
			{ path: "", redirectTo: "/home", pathMatch: "full" },
			{ path: "home", component: T19HomeComponent },
			{ path: "search", component: SearchPageComponent },
			{ path: "featured-listings", component: FeaturedListingsComponent },
			{ path: "property-detail", component: PropertyDetailComponent },
			{ path: "map", component: MapComponent },
			{ path: "buyer", component: BuyerComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calculator", component: CalculatorComponent },
			{ path: "seller", component: SellerComponent },
			{ path: "sellerdetails", component: SellerdetailComponent },
			{ path: "sellerdetails2", component: Sellerdetail2Component },
			{ path: "sellerdetails3", component: Sellerdetail3Component },
			{ path: "about", component: AboutComponent },
			{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
		],
	},
};
