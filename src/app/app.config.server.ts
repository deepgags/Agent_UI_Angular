import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CustomerService } from './services/customer.service';
import { NotificationService } from './services/notification.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { RoleService } from './services/role.service';
import { TemplateService } from './services/template.service';
import { PropertyService } from './services/property.service';
import { StorageService } from './services/storage.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    CustomerService,
    RoleService,
    TemplateService,
    PropertyService,
    NotificationService,
    StorageService,
    MatDialogModule,
    // ImageCropperModule,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    provideServerRendering(),
    provideServerRouting(serverRoutes)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
