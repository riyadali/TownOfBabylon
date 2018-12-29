interface Color {
    primary: string;
    secondary: string;
};
 
export class CalEvent {
  id: number;
  title: string;
  description?: string;
  start: Date;
  allDay?: boolean;
  end?: Date;      
  color: Color;
  //actions: string[];
  resizable?: {
        beforeStart: boolean;
        afterEnd: boolean;
  };
  draggable?: boolean;
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
