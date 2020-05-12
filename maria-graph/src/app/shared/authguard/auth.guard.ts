import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UrlTree, CanActivate, Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn !== true) {
      // window.alert("Acesso negado!");
      this.router.navigate(['/login'])
    }
    return true;
  }
}