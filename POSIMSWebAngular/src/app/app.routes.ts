import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { RoleGuard } from './services/auth/authguard/roleguard';
import { AuthGuard } from './services/auth/authguard/authguard';
import { PrintableSalesReportComponent } from './components/printable-sales-report/printable-sales-report.component';
import { PrintablePaymentReportComponent } from './components/printable-payment-report/printable-payment-report.component';
import { CustomerTableComponent } from './components/customer-table/customer-table/customer-table.component';

export const routes: Routes = [
  {
    
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'entity-history',
        loadChildren: () =>
          import('./pages/entity-history/entity-history.routes').then(
            (m) => m.EntityHistoryRoutes
          ),
      },
      {
        path: 'void-request',
        loadChildren: () =>
          import('./pages/void-request/void-request.routes').then(
            (m) => m.VoidRequestRoutes
          ),
      },
      {
        path: 'test',
        loadChildren: () =>
          import('./pages/test-component/test.routes').then(
            (m) => m.TestRoutes
          ),
      },

      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      
    ],
    canActivate: [RoleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  // {
  //     path: 'printable-sales-report',
  //     component: PrintableSalesReportComponent,
  //     canActivate: [RoleGuard],
  //   data: {
  //     roles: ['Admin'],
  //   },
  // },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
    ],
    canActivate: [RoleGuard],
    data: {
      roles: ['Admin', 'Owner'],
    },
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'cashier',
        loadChildren: () =>
          import('./pages/cashier/cashier.routes').then((m) => m.CashierRoutes),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('./pages/sales/sales.routes').then((m) => m.SalesRoutes),
      },
      {
        path: 'printable-sales-report',
        component: PrintableSalesReportComponent,
      },
      {
        path: 'printable-payment-report',
        component: PrintablePaymentReportComponent,
      },
      {
        path: 'customer',
        component: CustomerTableComponent,
      }
    ],
    canActivate: [RoleGuard],
    data: {
      roles: ['Admin', 'Cashier', 'Owner'],
    },
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/products/product.routes').then(
            (m) => m.ProductsRoutes
          ),
      },

      {
        path: 'stocks-receiving',
        loadChildren: () =>
          import('./pages/stocks-receiving/stocks-receiving.routes').then(
            (m) => m.StocksReceivingRoutes
          ),
      },
      {
        path: 'storage-location',
        loadChildren: () =>
          import('./pages/storage-location/storage-location.routes').then(
            (m) => m.StorageRoutes
          ),
      },
      {
        path: 'product-category',
        loadChildren: () =>
          import('./pages/product-category/product-category.routes').then(
            (m) => m.ProductCategoryRoutes
          ),
      },
    ],
    canActivate: [RoleGuard],
    data: {
      roles: ['Admin', 'Inventory'],
    },
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'inventory',
        loadChildren: () =>
          import('./pages/inventory/inventory.routes').then(
            (m) => m.InventoryRoutes
          ),
      },
    ],
    canActivate: [RoleGuard],
    data: {
      roles: ['Admin', 'Inventory', 'Owner'],
    },
  },
  
  {
    path: '',
    component: BlankComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
