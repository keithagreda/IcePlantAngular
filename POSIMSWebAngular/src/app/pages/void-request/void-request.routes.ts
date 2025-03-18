import { Routes } from '@angular/router';
import { VoidRequestComponent } from './void-request.component';

export const VoidRequestRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: VoidRequestComponent,
      },
    ],
  },
];
