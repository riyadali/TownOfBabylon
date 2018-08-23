/* From web site https://itnext.io/using-angular-6-material-auto-complete-with-async-data-6d89501c4b79 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
/* To fix map is not a function from web site https://stackoverflow.com/questions/34515173/angular-http-get-with-typescript-error-http-get-map-is-not-a-function-in-n */ 
/* import 'rxjs/add/operator/map'*/
import {map, tap} from 'rxjs/operators';
import {SearchDoc, IUserResponse} from './search-user.class'

@Injectable()
export class SearchService {

   constructor(private http: HttpClient) {}

  search(filter: {name: string} = {name: ''}, page = 1): Observable<SearchDoc[]> {
     /* original version of http get below -- updated it so that it treats the response as array instead of IUserResponse 
    return this.http.get<IUserResponse>('/api/searchusers') */
   
     let httpParams = new HttpParams().set('term', 'gar');    
     let httpHeaders = new HttpHeaders().set('Accept', 'application/json');
     /* refer to this site on why pipe is needed https://www.academind.com/learn/javascript/rxjs-6-what-changed/ */
    /* Note: proxied reference to town of babylon site to enable cross-origin sharing. A path rewrite is done for "/Search". 
       Refer to comments in src/proxy.conf.json for further details */
     return this.http.get<SearchDoc[]>('/Search/AutoComplete', {params: httpParams, headers: httpHeaders, responseType: 'json'})
       .pipe(             
              /* code that is case sensitive
              map(docs => docs.filter(doc => doc.value.includes(filter.name))
              */
              /* case insensitive filtering */
               map(docs => docs.filter(doc => doc.value.toLowerCase().includes(filter.name.toLowerCase()))
       )
     ); 
     /* original version of flow below -- updated it so that it treats the response as array of SearchUsers and filter done directly on
     response array of values
    .pipe(
      /* original version of tap below -- updated it so that it treats the response as array of SearchUsers 
      tap((response: IUserResponse) => {
        response.results = response.results
          .map(user => new SearchUser(user.id, user.name))
          // Not filtering in the server since in-memory-web-api has somewhat restricted api
          .filter(user => user.name.includes(filter.name))

        return response;
      }) -- end tap
      
     
      );  -- end pipe
      */
  }

}
