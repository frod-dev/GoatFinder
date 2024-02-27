import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return new Promise((res) => {
        this.firebaseService.getAuth().onAuthStateChanged((auth) => {
          if (!auth) {
            res(true);
          } else {
            this.utilsService.routerLink('/main/home');
            res(false);
          }
        })
      });
      
  }
  
}
