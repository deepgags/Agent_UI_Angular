import { Route } from "@angular/router";
import { PageDisplayComponent } from "./pages/public/page-display/page-display.component";
import { AboutComponent } from "./templates/shared/about/about.component";
import { BuyerComponent } from "./templates/shared/buyer/buyer.component";
import { CalculatorComponent } from "./templates/shared/calculator/calculator.component";
import { ContactComponent } from "./templates/shared/contact/contact.component";
import { FeaturedListingsComponent } from "./templates/shared/featured-listings/featured-listings.component";
import { MapComponent } from "./templates/shared/map/map.component";
import { MortgageCalculatorComponent } from "./templates/shared/mortgage-calculator/mortgage-calculator.component";
import { PropertyDetailPageComponent } from "./templates/shared/property-detail-page/property-detail-page.component";
import { SearchPageComponent } from "./templates/shared/search-page/search-page.component";
import { SellerComponent } from "./templates/shared/seller/seller.component";
import { SellerdetailComponent } from "./templates/shared/sellerdetail/sellerdetail.component";
import { TeamListComponent } from "./pages/public/team-list/team-list.component";
import { TeamDetailComponent } from "./pages/public/team-details/team-details.component";

export interface TemplateRoute {
	path: string;
	component: any;
	children: any[];
}

export interface TemplateRoutes {
	[key: string]: Route;
}

const generalRoutes: Route[] = [
	{ path: "", redirectTo: "/home", pathMatch: "full" },
	{ path: "search", component: SearchPageComponent },
	{ path: "featured-listings", component: FeaturedListingsComponent },
	{ path: "property-detail", component: PropertyDetailPageComponent },
	{ path: "map", component: MapComponent },
	{ path: "contact", component: ContactComponent },
	{ path: "calculator", component: CalculatorComponent },
	{ path: "seller", component: SellerComponent },
	// { path: "sellerdetails", component: SellerdetailComponent },
	// { path: "sellerdetails2", component: Sellerdetail2Component },
	// { path: "sellerdetails3", component: Sellerdetail3Component },
	{ path: "sellerdetails", component: SellerdetailComponent },
	{ path: "sellerdetails2", component: SellerdetailComponent },
	{ path: "sellerdetails3", component: SellerdetailComponent },
	{ path: "buyer", component: BuyerComponent },
	{ path: "about", component: AboutComponent },
	{ path: "mortgage-calculator", component: MortgageCalculatorComponent },
	{ path: "team", component: TeamListComponent },
	{ path: "team/:memberId", component: TeamDetailComponent },
	{ path: "page/:slug", component: PageDisplayComponent },
];

export const templates: TemplateRoutes = {
	t1: {
		path: "",
		loadComponent: () => import("./templates/t1/t1.component").then((c) => c.T1Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t1/t1-home/t1-home.component").then((c) => c.T1HomeComponent),
			},
		],
	},
	t2: {
		path: "",
		loadComponent: () => import("./templates/t2/t2.component").then((c) => c.T2Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t2/t2-home/t2-home.component").then((c) => c.T2HomeComponent),
			},
		],
	},
	t3: {
		path: "",
		loadComponent: () => import("./templates/t3/t3.component").then((c) => c.T3Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t3/t3-home/t3-home.component").then((c) => c.T3HomeComponent),
			},
		],
	},
	t4: {
		path: "",
		loadComponent: () => import("./templates/t4/t4.component").then((c) => c.T4Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t4/t4-home/t4-home.component").then((c) => c.T4HomeComponent),
			},
		],
	},
	t5: {
		path: "",
		loadComponent: () => import("./templates/t5/t5.component").then((c) => c.T5Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t5/t5-home/t5-home.component").then((c) => c.T5HomeComponent),
			},
		],
	},
	t6: {
		path: "",
		loadComponent: () => import("./templates/t6/t6.component").then((c) => c.T6Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t6/t6-home/t6-home.component").then((c) => c.T6HomeComponent),
			},
		],
	},
	t7: {
		path: "",
		loadComponent: () => import("./templates/t7/t7.component").then((c) => c.T7Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t7/t7-home/t7-home.component").then((c) => c.T7HomeComponent),
			},
		],
	},
	t8: {
		path: "",
		loadComponent: () => import("./templates/t8/t8.component").then((c) => c.T8Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t8/t8-home/t8-home.component").then((c) => c.T8HomeComponent),
			},
		],
	},
	t9: {
		path: "",
		loadComponent: () => import("./templates/t9/t9.component").then((c) => c.T9Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () => import("./templates/t9/t9-home/t9-home.component").then((c) => c.T9HomeComponent),
			},
		],
	},
	t10: {
		path: "",
		loadComponent: () => import("./templates/t10/t10.component").then((c) => c.T10Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t10/t10-home/t10-home.component").then((c) => c.T10HomeComponent),
			},
		],
	},
	t11: {
		path: "",
		loadComponent: () => import("./templates/t11/t11.component").then((c) => c.T11Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t11/t11-home/t11-home.component").then((c) => c.T11HomeComponent),
			},
		],
	},
	t12: {
		path: "",
		loadComponent: () => import("./templates/t12/t12.component").then((c) => c.T12Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t12/t12-home/t12-home.component").then((c) => c.T12HomeComponent),
			},
		],
	},
	t13: {
		path: "",
		loadComponent: () => import("./templates/t13/t13.component").then((c) => c.T13Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t13/t13-home/t13-home.component").then((c) => c.T13HomeComponent),
			},
		],
	},
	t14: {
		path: "",
		loadComponent: () => import("./templates/t14/t14.component").then((c) => c.T14Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t14/t14-home/t14-home.component").then((c) => c.T14HomeComponent),
			},
		],
	},
	t15: {
		path: "",
		loadComponent: () => import("./templates/t15/t15.component").then((c) => c.T15Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t15/t15-home/t15-home.component").then((c) => c.T15HomeComponent),
			},
		],
	},
	t16: {
		path: "",
		loadComponent: () => import("./templates/t16/t16.component").then((c) => c.T16Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t16/t16-home/t16-home.component").then((c) => c.T16HomeComponent),
			},
		],
	},
	t17: {
		path: "",
		loadComponent: () => import("./templates/t17/t17.component").then((c) => c.T17Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t17/t17-home/t17-home.component").then((c) => c.T17HomeComponent),
			},
		],
	},
	t18: {
		path: "",
		loadComponent: () => import("./templates/t18/t18.component").then((c) => c.T18Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t18/t18-home/t18-home.component").then((c) => c.T18HomeComponent),
			},
		],
	},
	t19: {
		path: "",
		loadComponent: () => import("./templates/t19/t19.component").then((c) => c.T19Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t19/t19-home/t19-home.component").then((c) => c.T19HomeComponent),
			},
		],
	},
	t20: {
		path: "",
		loadComponent: () => import("./templates/t20/t20.component").then((c) => c.T20Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t20/t20-home/t20-home.component").then((c) => c.T20HomeComponent),
			},
		],
	},
	t21: {
		path: "",
		loadComponent: () => import("./templates/t21/t21.component").then((c) => c.T21Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t21/t21-home/t21-home.component").then((c) => c.T21HomeComponent),
			},
		],
	},
	t22: {
		path: "",
		loadComponent: () => import("./templates/t22/t22.component").then((c) => c.T22Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t22/t22-home/t22home.component").then((c) => c.T22HomeComponent),
			},
		],
	},
	t23: {
		path: "",
		loadComponent: () => import("./templates/t23/t23.component").then((c) => c.T23Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t23/t23-home/t23home.component").then((c) => c.T23HomeComponent),
			},
		],
	},
	t24: {
		path: "",
		loadComponent: () => import("./templates/t24/t24.component").then((c) => c.T24Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t24/t24-home/t24home.component").then((c) => c.T24HomeComponent),
			},
		],
	},	
	t25: {
		path: "",
		loadComponent: () => import("./templates/t25/t25.component").then((c) => c.T25Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t25/t25-home/t25home.component").then((c) => c.T25HomeComponent),
			},
		],
	},
	t26: {
		path: "",
		loadComponent: () => import("./templates/t26/t26.component").then((c) => c.T26Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t26/t26-home/t26-home.component").then((c) => c.T26HomeComponent),
			},
		],
	},
	t27: {
		path: "",
		loadComponent: () => import("./templates/t27/t27.component").then((c) => c.T27Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t27/t27-home/t27-home.component").then((c) => c.T27HomeComponent),
			},
		],
	},
		t28: {
		path: "",
		loadComponent: () => import("./templates/t28/t28.component").then((c) => c.T28Component),
		children: [
			...generalRoutes,
			{
				path: "home",
				loadComponent: () =>
					import("./templates/t28/t28-home/t28-home.component").then((c) => c.T28HomeComponent),
			},
		],
	},
};