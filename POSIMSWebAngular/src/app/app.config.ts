import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';
//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import {
  API_BASE_URL,
  CustomerService,
  EntityHistoryService,
  InventoryReconcillationService,
  InventoryService,
  MachineProductionService,
  MachineService,
  NotificationService,
  PaymentService,
  PrinterLogsService,
  ProductCategoryService,
  ProductService,
  SalesService,
  StocksService,
  StorageLocationService,
  UserAuthService,
  VoidRequestService,
} from './services/nswag/nswag.service';
import { CartService } from './services/cart.service';
import { LoadingService } from './services/loading.service';
import { CustomInterceptor } from './services/interceptor/auth-interceptor.interceptor';
import { environment } from './services/environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    ProductService,
    ProductCategoryService,
    StocksService,
    StorageLocationService,
    SalesService,
    CartService,
    InventoryService,
    LoadingService,
    UserAuthService,
    EntityHistoryService,
    CustomerService,
    MachineService,
    MachineProductionService,
    NotificationService,
    VoidRequestService,
    InventoryReconcillationService,
    PrinterLogsService,
    PaymentService,
    {
      provide: API_BASE_URL,
      useValue: environment.apiBaseUrl,  // <-- Provide the base URL from environment.ts
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideAnimations(), // required animations providers
    provideToastr({
      timeOut: 3000, // Auto dismiss after 3 seconds
      positionClass: 'toast-top-right', // Position of the toast
      newestOnTop: false, // Ensures only one notification at a time
      maxOpened: 1, // Limit to 1 active toast
      preventDuplicates: true, // Prevent duplicate notifications
    }),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true,
    },
  ],
};
