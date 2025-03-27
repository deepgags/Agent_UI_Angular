import { Routes } from '@angular/router';
import { T1HomeComponent } from './templates/t1/t1-home/t1-home.component';
import { T1SearchComponent } from './templates/t1/t1-search/t1-search.component';
import { T1Component } from './templates/t1/t1.component';
import { T2HomeComponent } from './templates/t2/t2-home/t2-home.component';
import { T2SearchComponent } from './templates/t2/t2-search/t2-search.component';
import { T2Component } from './templates/t2/t2.component';



export const routes: Routes = [
    { path: '', redirectTo: '/t1', pathMatch: 'full' },
    // { path: '**', redirectTo: '/home' },
    // { path: 'home', component:  HomeComponent},
    {
        path: 't1',
        component: T1Component,
        children: [
            { path: '', redirectTo: '/t1/home', pathMatch: 'full' },
            { path: 'home', component:  T1HomeComponent},
            { path: 'search', component:  T1SearchComponent},
        ]
    },
    {
        path: 't2',
        component: T2Component,
        children: [
            { path: '', redirectTo: '/t2/home', pathMatch: 'full' },
            { path: 'home', component:  T2HomeComponent},
            { path: 'search', component:  T2SearchComponent},
        ]
    },
    // { path: 't2', component: T0002Component },
];
