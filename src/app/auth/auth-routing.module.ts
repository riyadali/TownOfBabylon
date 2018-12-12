// You can read more about guarded routes here https://angular.io/guide/router#milestone-5-route-guards
// Live code is found here https://stackblitz.com/angular/yregjpanjrn
// In that exapmle all admin routes are guarded so that you need to be logged in
// before you can access that section of the site
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard }            from './auth.guard';
import { AuthService }          from './auth.service';
// Because PageLoginComponent is loaded dynamically into the modal dialog,
// it is imported and defined as an entryComponent in app.module.ts.
// Refer to example in https://itnext.io/angular-create-your-own-modal-boxes-20bb663084a1
// import { PageLoginComponent }    from '../page-login/page-login.component';

const authRoutes: Routes = [
  // sign_in is no longer treated as a valid route
  // Sign_in can only be accessed through the sign_in button which dynamically
  // loads the PageLoginComponent in the modal component
  // { path: 'sign_in', component: PageLoginComponent, pathMatch: 'full' }
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
