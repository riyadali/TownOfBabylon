import { Component } from '@angular/core';
import { ModalService } from './modal.service';
import {Globals} from  './shared/app.global';  // for shared variables

import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Town of Babylon';
  
  removeModal() {
    this.modalService.destroy();
  }
  
  constructor(private modalService: ModalService, private globals: Globals, router: Router) { 
   
    // refer to this link https://stackoverflow.com/questions/33520043/how-to-detect-a-route-change-in-angular
    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        // clear message whenever you navigate to new page
        globals.msgInfo='';
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized  
    });
    
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
