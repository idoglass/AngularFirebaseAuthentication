import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from '../components/users/group/group.model';
import { GroupService } from '../components/users/group/group.service';
import { NgAuthService } from '../ng-auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoGroupGuard implements CanActivate {
  // group: Group;

  constructor(
    public ngAuthService: NgAuthService,
    public router: Router
  ){

   }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let group: Group;
      localStorage.getItem('group') ? group = JSON.parse(localStorage.getItem('group')) : localStorage.setItem('group', null);

      if (!group) {
        this.router.navigate(['dashboard/no-group']);
      }
      return true;
  }

}
