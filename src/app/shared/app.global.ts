// This module is for variables shared across the app

import { NgModule }       from '@angular/core';


@NgModule({  
  declarations: [ AppGlobal ],
  exports: [ AppGlobal ]
})
export class AppGlobal {
  msgInfo = '';
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
