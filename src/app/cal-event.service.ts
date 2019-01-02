import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, shareReplay } from 'rxjs/operators';

//import { CalendarEvent } from 'angular-calendar';
import { CalEvent } from './model/calEvent';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class CalEventService {

  private calEventsUrl = 'api/calEvents';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  
  private createCalendarEvent(cevent : CalEvent) : CalEvent {
       let result : CalEvent = {
             id: cevent.id,
             title: cevent.title,
             start: new Date(cevent.start),
             color: cevent.color,
             //actions: cevent.actions             
            };
    
        if (cevent.description)
          result.description=cevent.description;
        if (cevent.draggable) 
          result.draggable = cevent.draggable;
        if (cevent.resizable) 
          result.resizable = cevent.resizable;
        if (cevent.allDay) 
          result.allDay = cevent.allDay;
        if (cevent.end) 
          result.end = new Date(cevent.end);
      return result;  
  }

  /** GET calendar events from the server */
  getCalendarEvents (): Observable<CalEvent[]> {
    let self=this;
    return this.http.get<CalEvent[]>(this.calEventsUrl)
      .pipe(
        map<CalEvent[],CalEvent[]>(calEvents => calEvents.map(x=>self.createCalendarEvent(x))),
       // tap(calEvents => this.log(`fetched calendar events`)),
        catchError(this.handleError('getCalendarEvents', []))
      );
  }

  /** GET calendar event by id. Return `undefined` when id not found */
  getCalendarEventNo404<Data>(id: number): Observable<CalEvent> {
    const url = `${this.calEventsUrl}/?id=${id}`;
    return this.http.get<CalEvent[]>(url)
      .pipe(
        map(calEvents => calEvents[0]), // returns a {0|1} element array
        tap(c => {
          const outcome = c ? `fetched` : `did not find`;
          this.log(`${outcome} calendar event id=${id}`);
        }),
        catchError(this.handleError<CalEvent>(`getCalendarEvent id=${id}`))
      );
  }

  /** GET calerndar event by id. Will 404 if id not found */
  getCalendarEvent(id: number): Observable<CalEvent> {
    const url = `${this.calEventsUrl}/${id}`;
    return this.http.get<CalEvent>(url).pipe(
      tap(_ => this.log(`fetched calendar event id=${id}`)),
      catchError(this.handleError<CalEvent>(`getCalendarEvent id=${id}`))
    );
  }

  /* GET calendar events  whose title contains search term */
  searchCalendarEvents(term: string): Observable<CalEvent[]> {
    if (!term.trim()) {
      // if not search term, return empty calendar event array.
      return of([]);
    }
    return this.http.get<CalEvent[]>(this.calEventsUrl+`/?title=${term}`).pipe(
      tap(_ => this.log(`found calendar events whose title matches "${term}"`)),
      catchError(this.handleError<CalEvent[]>('searchCalendarEvents', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new calendar event to the server */
  addCalendarEvent (calEvent: CalEvent): Observable<CalEvent> {
    return this.http.post<CalEvent>(this.calEventsUrl, calEvent, httpOptions).pipe(
      tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      catchError(this.handleError<CalEvent>('addCalendarEvent'))
    );
  }

  /** DELETE: delete the calendar event from the server */
  deleteCalendarEvent (calEvent: CalEvent | number): Observable<CalEvent> {
    const id = typeof calEvent === 'number' ? calEvent : calEvent.id;
    const url = `${this.calEventsUrl}/${id}`;

    return this.http.delete<CalEvent>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted calendar event id=${id}`)),
      catchError(this.handleError<CalEvent>('deleteCalendarEvent'))
    );
  }

  /** PUT: update the calendar event on the server */  
  updateCalendarEvent (calEvent: CalEvent): Observable<any> {
     // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple PUT requests due to multiple subscriptions.
      let self=this; 
      return this.http.put<CalEvent>(this.calEventsUrl, calEvent) 
        // see this link on why pipe needs to be typed
        // https://stackoverflow.com/questions/52189638/rxjs-v6-3-pipe-how-to-use-it       
        .pipe<null,CalEvent>(
           // Put returns null response
           tap<null>( // Log the result or error
               // res => self.saveEvent(res), 
                res => {console.log("Calendar Event saved...")
                        return calEvent;
                        },         
                error => self.handleError<any>('updateCalendarEvent')
              ),
           shareReplay<CalEvent>()
        );   
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a CalendarEventService message with the MessageService */
  private log(message: string) {
    this.messageService.add('CalendarEventService: ' + message);
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
