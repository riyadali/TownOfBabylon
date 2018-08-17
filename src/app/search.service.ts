/* From web site https://itnext.io/using-angular-6-material-auto-complete-with-async-data-6d89501c4b79 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {SearchUser, IUserResponse} from './search-user.class'

@Injectable()
export class SearchService {

   constructor(private http: HttpClient) {}

  search(filter: {name: string} = {name: ''}, page = 1): Observable<IUserResponse> {
    return this.http.get<IUserResponse>('/api/searchusers')
    .pipe(
      tap((response: IUserResponse) => {
        response = response.map(user => new SearchUser(user.id, user.name))
          // Not filtering in the server since in-memory-web-api has somewhat restricted api
          .filter(user => user.name.includes(filter.name))    
        return response;,          
         })
    );
  }  

}
