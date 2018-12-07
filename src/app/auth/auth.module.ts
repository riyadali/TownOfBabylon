import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { PageLoginComponent }    from '../page-login/page-login.component';
import { AuthRoutingModule } from './auth-routing.module';
// page header component moved to separate module because it
// is being shared by app.module as well as auth.module
import { HeaderModule } from '../header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    AuthRoutingModule
  ],
  declarations: [
    PageLoginComponent
  ]
})
export class AuthModule {}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
