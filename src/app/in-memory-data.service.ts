import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
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
   let searchusers = [
        {   id: 1,
            name: "Windstorm",
            title: "sunt aut facit",
            body: "quia et su"
        },
        {   id: 2,
            name: "Bombasto",
            title: "sunt aut facit",
            body: "quia et su"
        },
        {   id: 3,
            name: "Magneta",
            title: "sunt aut facit",
            body: "quia et su"
        },
        {   id: 4,
            name: "Tornado",
            title: "sunt aut facit",
            body: "quia et su"
        },
        {   id: 5,
            name: "Agnosto",
            title: "sunt aut facit",
            body: "quia et su"
        }
    ];
   return {transactions, heroes, searchusers
  /* searchusers: {
     total: searchusers.length, 
      results: searchusers
    } */
    };
 }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
