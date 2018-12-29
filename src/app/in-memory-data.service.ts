import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ColorScheme } from './model/ColorScheme';

import {
  endOfMonth,  
  startOfDay,
  subDays,
  addDays,
  addHours,
  format
} from 'date-fns';


export class InMemoryDataService implements InMemoryDbService {
 
  // Some default color schemes
  redColorScheme : ColorScheme = {
      name: 'Red',
      primary: '#ad2121',
      secondary: '#FAE3E3'
  };

  yellowColorScheme : ColorScheme = {
      name: 'Yellow',
      primary: '#e3bc08',
      secondary: '#FDF1BA'
  };
 
  blueColorScheme : ColorScheme = {
      name: 'Blue',
      primary: '#1e90ff',
      secondary: '#D1E8FF'
  };
    
 createDb() {
   const transactions = [
     { id: 11, name: 'Mr. Nice', blockHeight: 521795},
     { id: 12, name: 'Narco', blockHeight: 521796 },
     { id: 13, name: 'Bombasto', blockHeight: 521797 },
     { id: 14, name: 'Celeritas', blockHeight: 521798 },
     { id: 15, name: 'Magneta', blockHeight: 521799 },
     { id: 16, name: 'RubberMan', blockHeight: 521800 },
     { id: 17, name: 'Dynama', blockHeight: 521801 },
     { id: 18, name: 'Dr IQ', blockHeight: 521802 },
     { id: 19, name: 'Magma', blockHeight: 521803 },
     { id: 20, name: 'Tornado', blockHeight: 521804 }
   ];
   const heroes = [
     { id: 11, name: 'Mr. Nice' },
     { id: 12, name: 'Narco' },
     { id: 13, name: 'Bombasto' },
     { id: 14, name: 'Celeritas' },
     { id: 15, name: 'Magneta' },
     { id: 16, name: 'RubberMan' },
     { id: 17, name: 'Dynama' },
     { id: 18, name: 'Dr IQ' },
     { id: 19, name: 'Magma' },
     { id: 20, name: 'Tornado' }
   ];
   let searchdocs = [
      { label: '<span class="autocompleteTitle">GYS  BBCC Garden</span><span class="autocompleteModuleName">Document Center</span>', value: 'GYS  BBCC Garden', link : null },
      { label: '<span class="autocompleteTitle">Deauville Gardens East</span><span class="autocompleteModuleName">Resource Directory</span>', value: 'Deauville Gardens East', link : null },
      { label: '<span class="autocompleteTitle">Babylon Gardens</span><span class="autocompleteModuleName">Page</span>', value: 'Babylon Gardens', link : null },
      { label: '<span class="autocompleteTitle">Can I recycle items found in my garage?</span><span class="autocompleteModuleName">FAQs</span>', value: 'Can I recycle items found in my garage?', link : null }
    ];
   let calEvents= [
    {
      id: 1,
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      description: 'Yabba Dabba Doo',
      color: this.redColorScheme,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      id: 2,
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: this.yellowColorScheme
    },
    {
      id: 3,
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: this.blueColorScheme,
      allDay: true
    },
    {
      id: 4,
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: this.yellowColorScheme,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];
   return {transactions, heroes, calEvents
   /*searchusers: {
      total: searchusers.length,
      results: searchusers
    }*/};
 }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
