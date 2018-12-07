import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard }            from './auth.guard';
import { AuthService }          from './auth.service';
import { PageLoginComponent }    from '../page-login/page-login.component';

const authRoutes: Routes = [
  { path: 'sign_in', component: PageLoginComponent, pathMatch: 'full' }
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
