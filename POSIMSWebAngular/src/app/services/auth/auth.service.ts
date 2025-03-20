import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRolesSubject = new BehaviorSubject<string[]>([]);
  userRoles$ = this.userRolesSubject.asObservable();
  constructor(private router: Router) {}
  token: string | null = null;

  getUserId(): string | null {
    this.token = localStorage.getItem('token');
    if (this.token) {
      const decoded: any = jwtDecode(this.token);

      return (
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] || null
      );
    } else {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUserRoles(): string[] {
    this.token = localStorage.getItem('token');
    if (this.token) {
      try {
        const decoded: any = jwtDecode(this.token);
        const roles =
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ] || [];
        this.userRolesSubject.next(roles); // Correct assignment
        console.log(this.userRolesSubject);
        return roles;
      } catch (error) {
        console.error('Invalid token:', error);
        this.userRolesSubject.next([]);
        return [];
      }
    } else {
      this.userRolesSubject.next([]);
      return [];
    }
  }

  getUserRolesObservable(): Observable<string[]> {
    return this.userRolesSubject.asObservable();
  }

  hasRole(role: string): boolean {
    return this.userRolesSubject.value?.includes(role) ?? false;
  }

  getMainRouteForUser(): string {
    const roles = this.getUserRoles();

    if (roles.includes('Admin')) {
      return '/dashboard';
    }
    if (roles.includes('Cashier')) {
      return '/cashier';
    }
    if (roles.includes('Inventory')) {
      return '/inventory';
    }
    if (roles.includes('Owner')) {
      return '/dashboard';
    }

    return '/authentication/login'; // Default route if no roles match
  }

  onlogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.userRolesSubject.next([]); // Clear roles on logout
    this.router.navigate(['authentication/login']);
  }
}
