// You can read more about guards here https://angular.io/guide/router#milestone-5-route-guards
// Live code is found here https://stackblitz.com/angular/yregjpanjrn
// In that exapmle all admin routes are guarded so that you need to be logged in
// before you can access that section of the site
import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
 // CanActivateChild,
 // NavigationExtras,
  CanLoad, Route
} from '@angular/router';
import { AuthService }      from './auth.service';
import { ModalService } from '../modal.service';
import { PageLoginComponent } from "../page-login/page-login.component";

@Injectable({
  providedIn: 'root',
})
//export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService: AuthService, private modalService: ModalService, private router: Router) {}
  
  private loadLoginModal() {
   // this.close(); // close this modal dialog
    let inputs = {
      isMobile: false
    }
    this.modalService.init(PageLoginComponent, inputs, {});
  }

  // A guard's return value controls the router's behavior:
  //        If it returns true, the navigation process continues.
  //        If it returns false, the navigation process stops and the user stays put.
  //        If it returns a UrlTree, the current navigation cancels and a new navigation is initiated to the UrlTree returned.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  // This is to protect child routes -- for example all routes under /admin
  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //  return this.canActivate(route, state);
  // }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn()) { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url; 

    // Create a dummy session id
    // let sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    // let navigationExtras: NavigationExtras = {
    //  queryParams: { 'session_id': sessionId },
    //  fragment: 'anchor'
    // };

    // notes on Fragments --
    // Navigate to /results#top
    // this.router.navigate(['/results'], { fragment: 'top' });

    // Navigate to the login page with extras
    // this.router.navigate(['/login'], navigationExtras);

    // Navigate to the login page
    // this.router.navigate(['/sign_in']);

    // For all guarded routes use the home page as default page
    // with sign_in page displayed as modal
    this.router.navigate(['/home']);
    this.loadLoginModal();
    return false;
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
