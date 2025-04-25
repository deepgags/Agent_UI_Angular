import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TemplateComponent } from './components/template/template.component';
import { SearchPageComponent } from './templates/shared/search-page/search-page.component';
import { T1HomeComponent } from './templates/t1/t1-home/t1-home.component';
import { T1Component } from './templates/t1/t1.component';
import { T2HomeComponent } from './templates/t2/t2-home/t2-home.component';
import { T3HomeComponent } from './templates/t3/t3-home/t3-home.component';
import { T2Component } from './templates/t2/t2.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { RedirectUserComponent } from './components/redirectuser/redirectuser.component';
import { PropertydetailComponent } from './templates/shared/propertydetail/propertydetail.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { MapComponent } from './templates/shared/map/map.component';
import { AboutComponent } from './templates/shared/about/about.component';
import { BuyerComponent } from './templates/shared/buyer/buyer.component';
import { ContactComponent } from './templates/shared/contact/contact.component';
import { CalculatorComponent } from './templates/shared/calculator/calculator.component';
import { SellerComponent } from './templates/shared/seller/seller.component';
import { PaymentComponent } from './components/payment/payment.component';
import { T3Component } from './templates/t3/t3.component';
import { SellerdetailComponent } from './templates/shared/sellerdetail/sellerdetail.component';
import { Sellerdetail2Component } from './templates/shared/sellerdetail2/sellerdetail2.component';
import { Sellerdetail3Component } from './templates/shared/sellerdetail3/sellerdetail3.component';
import { FeaturedListingsComponent } from './templates/shared/featured-listings/featured-listings.component';

export const routes: Routes = [
    { path: '', redirectTo: '/loading', pathMatch: 'full' },
    { path: 'login', component:  LoginComponent},
    { path: 'loading', component:  RedirectUserComponent},
    { path: 'register', component:  RegisterComponent},
    { path: 'template', component:  TemplateComponent},
    { path: 'home', component:  HomeComponent},
    { path: 'thanks', component:  ThankyouComponent},
    { path: 'payment', component:  PaymentComponent},
    { path: 'notfound', component:  NotfoundComponent},
    {
        path: 't1',
        component: T1Component,
        children: [
            { path: '', redirectTo: '/t1/home', pathMatch: 'full' },
            { path: 'home', component:  T1HomeComponent},
            { path: 'search', component:  SearchPageComponent},
            { path: 'featuredlistings', component:  FeaturedListingsComponent},
            { path: 'propertydetail', component:  PropertydetailComponent},
            { path: 'map', component:  MapComponent},
            { path: 'buyer', component:  BuyerComponent},
            { path: 'contact', component:  ContactComponent},
            { path: 'calculator', component:  CalculatorComponent},
            { path: 'seller', component:  SellerComponent},
            { path: 'sellerdetails', component: SellerdetailComponent},
            { path: 'sellerdetails2', component: Sellerdetail2Component},
            { path: 'sellerdetails3', component: Sellerdetail3Component},
            { path: 'about', component:  AboutComponent},
        ]
    },
    {
        path: 't2',
        component: T2Component,
        children: [
            { path: '', redirectTo: '/t2/home', pathMatch: 'full' },
            { path: 'home', component:  T2HomeComponent},
            { path: 'search', component:  SearchPageComponent} ,
            { path: 'featuredlistings', component:  FeaturedListingsComponent},
            { path: 'propertydetail', component:  PropertydetailComponent},   
            { path: 'map', component:  MapComponent},
            { path: 'buyer', component:  BuyerComponent},
            { path: 'contact', component:  ContactComponent},
            { path: 'calculator', component:  CalculatorComponent},
            { path: 'seller', component:  SellerComponent},
            { path: 'sellerdetails', component: SellerdetailComponent},
            { path: 'sellerdetails2', component: Sellerdetail2Component},
            { path: 'sellerdetails3', component: Sellerdetail3Component},
            { path: 'about', component:  AboutComponent},
        ]
    },
    {
        path: 't3',
        component: T3Component,
        children: [
            { path: '', redirectTo: '/t3/home', pathMatch: 'full' },
            { path: 'home', component:  T3HomeComponent},
            { path: 'search', component:  SearchPageComponent},
            { path: 'featuredlistings', component:  FeaturedListingsComponent},
            { path: 'propertydetail', component:  PropertydetailComponent},   
            { path: 'map', component:  MapComponent},
            { path: 'buyer', component:  BuyerComponent},
            { path: 'contact', component:  ContactComponent},
            { path: 'calculator', component:  CalculatorComponent},
            { path: 'seller', component:  SellerComponent},
            { path: 'sellerdetails', component: SellerdetailComponent},
            { path: 'sellerdetails2', component: Sellerdetail2Component},
            { path: 'sellerdetails3', component: Sellerdetail3Component},
            { path: 'about', component:  AboutComponent},
        ]
    },
    // { path: 't2', component: T0002Component },
];
