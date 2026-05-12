import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/customers/customers.component').then((m) => m.CustomersComponent),
      },
      {
        path: 'customers/:id',
        loadComponent: () => import('./pages/customer-detail/customer-detail.component').then((m) => m.CustomerDetailComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'roles',
        loadComponent: () => import('./pages/roles/roles.component').then((m) => m.RolesComponent),
      },
      {
        path: 'templates',
        loadComponent: () => import('./pages/templates/templates.component').then((m) => m.TemplatesComponent),
      },
      {
        path: 'lead-types',
        loadComponent: () => import('./pages/lead-types/lead-types.component').then((m) => m.LeadTypesComponent),
      },
      {
        path: 'property-types',
        loadComponent: () => import('./pages/property-types/property-types.component').then((m) => m.PropertyTypesComponent),
      },
      {
        path: 'property-subtypes',
        loadComponent: () => import('./pages/property-subtypes/property-subtypes.component').then((m) => m.PropertySubtypesComponent),
      },
      {
        path: 'cities',
        loadComponent: () => import('./pages/cities/cities.component').then((m) => m.CitiesComponent),
      },
      {
        path: 'properties',
        loadComponent: () => import('./pages/properties/properties.component').then((m) => m.PropertiesComponent),
      },
      {
        path: 'properties/:id',
        loadComponent: () => import('./pages/property-details/property-details.component').then((m) => m.PropertyDetailsComponent),
      },
      {
        path: 'audit-logs',
        loadComponent: () => import('./pages/audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];