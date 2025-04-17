import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TemplateComponent } from './components/template/template.component';
import { SearchPageComponent } from './templates/shared/search-page/search-page.component';
import { T1HomeComponent } from './templates/t1/t1-home/t1-home.component';
import { T1Component } from './templates/t1/t1.component';
import { T2HomeComponent } from './templates/t2/t2-home/t2-home.component';
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

export const routes: Routes = [
    { path: '', redirectTo: '/loading', pathMatch: 'full' },
    { path: 'login', component:  LoginComponent},
    { path: 'loading', component:  RedirectUserComponent},
    { path: 'register', component:  RegisterComponent},
    { path: 'template', component:  TemplateComponent},
    { path: 'home', component:  HomeComponent},
    { path: 'thanks', component:  ThankyouComponent},
    { path: 'map', component:  MapComponent},
    { path: 'buyer', component:  BuyerComponent},
    { path: 'contact', component:  ContactComponent},
    { path: 'calculator', component:  CalculatorComponent},
    { path: 'seller', component:  SellerComponent},
    { path: 'about', component:  AboutComponent},
    { path: 'payment', component:  PaymentComponent},
    { path: 'notfound', component:  NotfoundComponent},
    {
        path: 't1',
        component: T1Component,
        children: [
            { path: '', redirectTo: '/t1/home', pathMatch: 'full' },
            { path: 'home', component:  T1HomeComponent},
            { path: 'search', component:  SearchPageComponent},
            { path: 'propertydetail', component:  PropertydetailComponent},
        ]
    },
    {
        path: 't2',
        component: T2Component,
        children: [
            { path: '', redirectTo: '/t2/home', pathMatch: 'full' },
            { path: 'home', component:  T2HomeComponent},
            { path: 'search', component:  SearchPageComponent} ,
            { path: 'propertydetail', component:  PropertydetailComponent},           
        ]
    },
    // { path: 't2', component: T0002Component },
];
