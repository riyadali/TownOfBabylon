// Some components moved to separate module because they
// are being shared by app.module as well as auth.module

import { NgModule }       from '@angular/core';

import { HeaderComponent } from './header/header.component';

@NgModule({  
  declarations: [ HeaderComponent ],
  exports: [ HeaderComponent ]
})
export class AppCommonModule {}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
