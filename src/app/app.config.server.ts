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
import { BrokerageTypeService } from './services/brokerage.service';
import { TemplateService } from './services/template.service';
import { PropertyService } from './services/property.service';
import { StorageService } from './services/storage.service';
import { SharedDataService } from './services/shareddata.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    SharedDataService,
    CustomerService,
    RoleService,
    BrokerageTypeService,
    TemplateService,
    PropertyService,
    NotificationService,
    StorageService,
    MatDialogModule,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    provideServerRendering(),
    provideServerRouting(serverRoutes)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
