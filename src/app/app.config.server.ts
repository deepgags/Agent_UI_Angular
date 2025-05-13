import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { BrokerageTypeService } from './services/brokerage.service';
import { CustomerService } from './services/customer.service';
import { InterestedUserService } from './services/interestedUser.service';
import { NotificationService } from './services/notification.service';
import { PropertyService } from './services/property.service';
import { SharedDataService } from './services/shareddata.service';
import { StorageService } from './services/storage.service';
import { TemplateService } from './services/template.service';

const serverConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withFetch()),
		provideAnimations(),
		Title,
		SharedDataService,
		CustomerService,
		InterestedUserService,
		BrokerageTypeService,
		TemplateService,
		PropertyService,
		NotificationService,
		StorageService,
		MatDialogModule,
		{ provide: MAT_DIALOG_DATA, useValue: {} },
		{ provide: MatDialogRef, useValue: {} },
		{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
		provideServerRendering(),
		provideServerRouting(serverRoutes)
	]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
