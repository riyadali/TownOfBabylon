// refer to this link for detailed instructions on usage -- http://www.istruction.nl/blog/2018/1/26/using-the-angular-inmemorywebapi

// refer to this link for code -- https://github.com/angular/in-memory-web-api/blob/master/src/app/hero-in-mem-data-override.service.ts
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ParsedRequestUrl, RequestInfo, RequestInfoUtilities, ResponseOptions } from 'angular-in-memory-web-api';

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
  
  // from site https://github.com/angular/in-memory-web-api/blob/master/src/app/hero-in-mem-data-override.service.ts
  // intercept ResponseOptions from default HTTP method handlers
  // add a response header and report interception to console.log
  // -- change name by removing my and you should get hte reponse logged
  myresponseInterceptor(resOptions: ResponseOptions, reqInfo: RequestInfo) {

   // resOptions.headers = resOptions.headers.set('x-test', 'test-header');
    const method = reqInfo.method.toUpperCase();
    const body = JSON.stringify(resOptions);
    console.log(`responseInterceptor: ${method} ${reqInfo.req.url}: \n${body}`);

    return resOptions;
  }
  
  // parseRequestUrl override
  // Do this to manipulate the request URL or the parsed result
  // into something your data store can handle.
  // This example turns a request for `/foo/heroes` into just `/heroes`.
  // It leaves other URLs untouched and forwards to the default parser.
  // It also logs the result of the default parser.
  exampleParseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    const newUrl = url.replace(/\/foo\/heroes/, '/heroes');
    // console.log('newUrl', newUrl);
    const parsed = utils.parseRequestUrl(newUrl);
    console.log(`parseRequestUrl override of '${url}':`, parsed);
    return parsed;
  }
  
  // override request for colorschemes?owner=xxxx with colorschemes?owner=4
  parseRequestUrl(url: string, utils: RequestInfoUtilities): ParsedRequestUrl {
    const newUrl = url.replace(/colorSchemes\?owner=[0-9A-F]+/, '/colorSchemes?owner=2');
    // console.log('newUrl', newUrl);
    const parsed = utils.parseRequestUrl(newUrl);
    console.log(`parseRequestUrl override of '${url}':`, parsed);
    return parsed;
  }
 
  // Some default color schemes
  redColorScheme : ColorScheme = {
      id: 1,
      name: 'Red',
      primary: '#ad2121',
      secondary: '#FAE3E3'
  };

  yellowColorScheme : ColorScheme = {
      id: 2,
      name: 'Yellow',
      primary: '#e3bc08',
      secondary: '#FDF1BA'
  };
 
  blueColorScheme : ColorScheme = {
      id: 3,
      name: 'Blue',
      primary: '#1e90ff',
      secondary: '#D1E8FF'
  };
  
  // Should never see this since it has an owner field
  bogusColorScheme : ColorScheme = {
      id: 4,
      owner: 0,
      name: 'Bogus',
      primary: '#1e90ff',
      secondary: '#D1E8FF'
  };
  
  // TommyCat colorscheme
  TommyColorScheme : ColorScheme = {
      id: 5,
      owner: 2,
      name: 'TommyCat',
      primary: '#1e90ff',
      secondary: '#D1E8FF'
  };
  
  // Tom2 colorscheme
  Tom2SomeCatColorScheme : ColorScheme = {
      id: 6,
      owner: 0x5beb31df5ca37814009938b7,
      name: 'Tom2SomeCat',
      primary: '#1e90ff',
      secondary: '#D1E8FF'
  };
  
  // Tom3 colorscheme
  Tom3SomeCat2ColorScheme : ColorScheme = {
      id: 7,
      owner: 0x5beb360f5ca37814009938bb,
      name: 'Tom3SomeCat2',
      primary: '#1e90ff',
      secondary: '#D1E8FF'
  };
    
 
  // Overrides the genId method to ensure that an event always has an id.
  // If the events array is empty,
  // the method below returns the initial number (5).
  // if the events array is not empty, the method below returns the highest
  // events id + 1.
  genId(calEvents: any[]): number {
    return calEvents.length > 0 ? Math.max(...calEvents.map(calEvent => calEvent.id)) + 1 : 8;
  }
    
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
      draggable: true,
      location: 'Babylon Town Hall',
      address: `200 East Sunrise Highway
Lindenhurst, NY 11757`,
      contact: 'tob@gmail.com or call (631) 957-3000',
      cost: 'Free',
      link: new URL('https://www.townofbabylon.com/DocumentCenter/View/3105')
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
  let colorSchemes: ColorScheme[] = [
    this.redColorScheme,
    this.blueColorScheme,
    this.yellowColorScheme,
    this.bogusColorScheme,
    this.TommyColorScheme,
    this.Tom2SomeCatColorScheme,
    this.Tom3SomeCat2ColorScheme
  ];
  return {transactions, heroes, calEvents, colorSchemes
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
