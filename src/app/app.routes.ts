import { Routes } from '@angular/router';
import { AloginComponent } from './components/alogin/alogin.component';
import { ChangeComponent } from './components/change/change.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { HomeComponent } from './components/home/home.component';
// import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RedirectUserComponent } from './components/redirectuser/redirectuser.component';
// import { RegisterComponent } from './components/register/register.component';
import { TemplateComponent } from './components/template/template.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { UsertemplateComponent } from './components/usertemplate/usertemplate.component';
import { VerifyComponent } from './components/verify/verify.component';
import { WebsiteSettingsComponent } from './pages/private/website-settings/website-settings.component';
import { AboutComponent } from './templates/shared/about/about.component';
import { BuyerComponent } from './templates/shared/buyer/buyer.component';
import { CalculatorComponent } from './templates/shared/calculator/calculator.component';
import { ContactComponent } from './templates/shared/contact/contact.component';
import { FeaturedListingsComponent } from './templates/shared/featured-listings/featured-listings.component';
import { MapComponent } from './templates/shared/map/map.component';
import { PropertydetailComponent } from './templates/shared/propertydetail/propertydetail.component';
import { SearchPageComponent } from './templates/shared/search-page/search-page.component';
import { SellerComponent } from './templates/shared/seller/seller.component';
import { SellerdetailComponent } from './templates/shared/sellerdetail/sellerdetail.component';
import { Sellerdetail2Component } from './templates/shared/sellerdetail2/sellerdetail2.component';
import { Sellerdetail3Component } from './templates/shared/sellerdetail3/sellerdetail3.component';
import { T1HomeComponent } from './templates/t1/t1-home/t1-home.component';
import { T1Component } from './templates/t1/t1.component';
import { T2HomeComponent } from './templates/t2/t2-home/t2-home.component';
import { T2Component } from './templates/t2/t2.component';
import { T3HomeComponent } from './templates/t3/t3-home/t3-home.component';
import { T3Component } from './templates/t3/t3.component';
import { T4HomeComponent } from './templates/t4/t4-home/t4-home.component';
import { T4Component } from './templates/t4/t4.component';
import { T5HomeComponent } from './templates/t5/t5-home/t5-home.component';
import { T5Component } from './templates/t5/t5.component';
import { T6Component } from './templates/t6/t6.component';
import { T7Component } from './templates/t7/t7.component';
import { T7HomeComponent } from './templates/t7/t7-home/t7-home.component';
import { T6HomeComponent } from './templates/t6/t6-home/t6-home.component';
import { T8Component } from './templates/t8/t8.component';
import { T8HomeComponent } from './templates/t8/t8-home/t8-home.component';
import { T9HomeComponent } from './templates/t9/t9-home/t9-home.component';
import { T9Component } from './templates/t9/t9.component';
import { T11HomeComponent } from './templates/t11/t11-home/t11-home.component';
import { T11Component } from './templates/t11/t11.component';
import { T12Component } from './templates/t12/t12.component';
import { T12HomeComponent } from './templates/t12/t12-home/t12-home.component';
import { T10Component } from './templates/t10/t10.component';
import { T10HomeComponent } from './templates/t10/t10-home/t10-home.component';

export const routes: Routes = [
    { path: '', redirectTo: '/loading', pathMatch: 'full' },
    { path: 'loading', component: RedirectUserComponent },
    // { path: 'login', component: LoginComponent },
    { path: 'agent-login', component: AloginComponent },
    { path: 'forgot-password', component: ForgotComponent },
    { path: 'verify', component: VerifyComponent },
    {
        path: 'admin',
        children: [
            { path: 'settings', component: WebsiteSettingsComponent },
            { path: 'change-password', component: ChangeComponent },
            { path: 'template', component: TemplateComponent },
        ]
    },
    // { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'thanks', component: ThankyouComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'notfound', component: NotfoundComponent },
    { path: 'profile', component: ProfileComponent },
    // { path: 'userAdmin', component: AdminComponent },
    { path: 'usertemplate', component: UsertemplateComponent },
    {
        path: 't1',
        component: T1Component,
        children: [
            { path: '', redirectTo: '/t1/home', pathMatch: 'full' },
            { path: 'home', component: T1HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't2',
        component: T2Component,
        children: [
            { path: '', redirectTo: '/t2/home', pathMatch: 'full' },
            { path: 'home', component: T2HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't3',
        component: T3Component,
        children: [
            { path: '', redirectTo: '/t3/home', pathMatch: 'full' },
            { path: 'home', component: T3HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't4',
        component: T4Component,
        children: [
            { path: '', redirectTo: '/t4/home', pathMatch: 'full' },
            { path: 'home', component: T4HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't5',
        component: T5Component,
        children: [
            { path: '', redirectTo: '/t5/home', pathMatch: 'full' },
            { path: 'home', component: T5HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't6',
        component: T6Component,
        children: [
            { path: '', redirectTo: '/t6/home', pathMatch: 'full' },
            { path: 'home', component: T6HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't7',
        component: T7Component,
        children: [
            { path: '', redirectTo: '/t7/home', pathMatch: 'full' },
            { path: 'home', component: T7HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't8',
        component: T8Component,
        children: [
            { path: '', redirectTo: '/t8/home', pathMatch: 'full' },
            { path: 'home', component: T8HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't9',
        component: T9Component,
        children: [
            { path: '', redirectTo: '/t9/home', pathMatch: 'full' },
            { path: 'home', component: T9HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't10',
        component: T10Component,
        children: [
            { path: '', redirectTo: '/t10/home', pathMatch: 'full' },
            { path: 'home', component: T10HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't11',
        component: T11Component,
        children: [
            { path: '', redirectTo: '/t11/home', pathMatch: 'full' },
            { path: 'home', component: T11HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    },
    {
        path: 't12',
        component: T12Component,
        children: [
            { path: '', redirectTo: '/t12/home', pathMatch: 'full' },
            { path: 'home', component: T12HomeComponent },
            { path: 'search', component: SearchPageComponent },
            { path: 'featuredlistings', component: FeaturedListingsComponent },
            { path: 'propertydetail', component: PropertydetailComponent },
            { path: 'map', component: MapComponent },
            { path: 'buyer', component: BuyerComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'calculator', component: CalculatorComponent },
            { path: 'seller', component: SellerComponent },
            { path: 'sellerdetails', component: SellerdetailComponent },
            { path: 'sellerdetails2', component: Sellerdetail2Component },
            { path: 'sellerdetails3', component: Sellerdetail3Component },
            { path: 'about', component: AboutComponent },
        ]
    }
    // { path: 't2', component: T0002Component },
];
