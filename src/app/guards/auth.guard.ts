import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ClientService } from '../services/supabase/client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private clientService: ClientService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.clientService.isAuthenticated()) {
      console.log('passt');
      // oder isLoggedIn()
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
