import { Routes } from '@angular/router';
import { T0001Component } from './templates/t-0001/t-0001.component';
import { T0002Component } from './templates/t-0002/t-0002.component';
import { HomeComponent } from './pages/core/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { TemplateComponent } from './components/template/template.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component:  LoginComponent},
    { path: 'register', component:  RegisterComponent},
    { path: 'template', component:  TemplateComponent},
    { path: 'home', component:  HomeComponent},
    { path: 'notfound', component:  HomeComponent},
    // { path: 't1', component:  T0001Component},
    // { path: 't2', component: T0002Component },
];
