import { Routes } from '@angular/router';
import { T0001Component } from './templates/t-0001/t-0001.component';
import { T0002Component } from './templates/t-0002/t-0002.component';
import { HomeComponent } from './pages/core/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // { path: '**', redirectTo: '/home' },
    { path: 'home', component:  HomeComponent},
    { path: 't1', component:  T0001Component},
    // { path: 't2', component: T0002Component },
];
