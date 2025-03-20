import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // Check if the user is logged in
    if (this.authService.isLoggedIn()) {
      // Redirect logged-in users to their main route
      return this.router.parseUrl(this.authService.getMainRouteForUser());
    }

    // If not logged in, allow access (e.g., to login page)
    return true;
  }
}
