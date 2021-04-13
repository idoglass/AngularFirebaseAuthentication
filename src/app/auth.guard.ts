import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from './components/users/group/group.model';
import { GroupService } from './components/users/group/group.service';
import { NgAuthService } from './ng-auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    public ngAuthService: NgAuthService,
    public router: Router,
    public groupService: GroupService
  ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const url: string = state.url;
  
      if (this.ngAuthService.isLoggedIn !== true) {
        this.router.navigate(['sign-in']);
      }
    // Store the attempted URL for redirecting
      this.ngAuthService.redirectUrl = url;
      return true;
  }

}
