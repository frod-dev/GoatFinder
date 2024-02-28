import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseService = inject(FirebaseService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let user = localStorage.getItem('user');

      return new Promise((res) => {
        this.firebaseService.getAuth().onAuthStateChanged((auth) => {
          if (auth) {
            if (user) res(true);
          } else {
            this.firebaseService.signOut();
            res(false);
          }
        })
      });
      
  }
  
}
