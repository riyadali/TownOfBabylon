import { ColorScheme } from './ColorScheme';

export class CalEvent {

  id?: string | number;
  title: string;
  description?: string;
  start: Date;
  allDay?: boolean;
  end?: Date;      
  color: ColorScheme;
  //actions: string[];
  resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
  };
  draggable?: boolean;
  location?: string;
  address?: string;
  contact?: string;
  link?: URL;
  cost?: string;
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
