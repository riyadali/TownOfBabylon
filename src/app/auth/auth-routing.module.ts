// You can read more about guarded routes here https://angular.io/guide/router#milestone-5-route-guards
// Live code is found here https://stackblitz.com/angular/yregjpanjrn
// In that exapmle all admin routes are guarded so that you need to be logged in
// before you can access that section of the site
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard }            from './auth.guard';
import { AuthService }          from './auth.service';
import { PageHomeComponent }   from '../page-home/page-home.component';
// Because PageLoginComponent is loaded dynamically into the modal dialog,
// it is imported and defined as an entryComponent in app.module.ts.
// Refer to example in https://itnext.io/angular-create-your-own-modal-boxes-20bb663084a1
// import { PageLoginComponent }    from '../page-login/page-login.component';

const authRoutes: Routes = [
  // sign_in is used if some accesses the sign_in link directly
  // what would happen in this case is the page home component would
  // be loaded with the login component displayed as a modal
  // The canActivate Authguard will force the load of the login component
  { 
   path: 'sign_in', 
   component: PageHomeComponent,   
   canActivate: [AuthGuard],
   pathMatch: 'full' 
 },
  // register is used if some accesses the register link directly
  // what would happen in this case is the page home component would
  // be loaded with the register component displayed as a modal
  // The canActivate Authguard will force the load of the register component
  { 
   path: 'register', 
   component: PageHomeComponent,   
   canActivate: [AuthGuard],
   pathMatch: 'full' 
 }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
