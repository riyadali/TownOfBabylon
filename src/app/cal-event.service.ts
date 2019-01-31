import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, shareReplay } from 'rxjs/operators';

//import { CalendarEvent } from 'angular-calendar';
import { CalEvent } from './model/CalEvent';
import { ColorScheme } from './model/ColorScheme';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

import {apiURL} from './config';

interface GetEventsResponse {
   calendarEvents: CalEvent[];
   calendarEventsCount: number
}

interface GetColorsResponse {
   colorSchemes: ColorScheme[];
   colorSchemesCount: number
}

@Injectable({ providedIn: 'root' })
export class CalEventService {

  private calEventsUrl = apiURL+'calEvents';  // URL to web api
  private colorSchemesUrl = apiURL+'colorSchemes';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  
  private createCalendarEvent(parsedEvent : any) : CalEvent {
       let result : CalEvent = {
             id: parsedEvent.id,
             title: parsedEvent.title,
             slug: parsedEvent.slug,
             start: new Date(parsedEvent.start),
             owner: parsedEvent.owner.id,
             color: {
                      id: parsedEvent.color.id,
                      name: parsedEvent.color.name,
                      slug: parsedEvent.color.slug,
                      primary: parsedEvent.color.primary,
                      secondary: parsedEvent.color.secondary
                    }
             //actions: parsedEvent.actions             
            };
    
        if (parsedEvent.description)
          result.description=parsedEvent.description;
        if (parsedEvent.location)
          result.location = parsedEvent.location;
        if (parsedEvent.address)
          result.address = parsedEvent.address;
        if (parsedEvent.contact)
          result.contact = parsedEvent.contact;
        if (parsedEvent.cost)
          result.cost = parsedEvent.cost;
        if (parsedEvent.link)
          result.link = parsedEvent.link;
        if (parsedEvent.draggable) 
          result.draggable = parsedEvent.draggable;
        if (parsedEvent.resizable) 
          result.resizable = parsedEvent.resizable;
        if (parsedEvent.allDay) 
          result.allDay = parsedEvent.allDay;
        if (parsedEvent.end) 
          result.end = new Date(parsedEvent.end);
      return result;  
  }

  /** GET calendar events from the server */
  getCalendarEvents (): Observable<CalEvent[]> {
    let self=this;
    return this.http.get<GetEventsResponse>(this.calEventsUrl)
      .pipe(
        map<GetEventsResponse,CalEvent[]>(response => { 
          // console.log("response..."+JSON.stringify(response))
          return response.calendarEvents.map(x=>self.createCalendarEvent(x))
        }),
       // tap(calEvents => this.log(`fetched calendar events`)),
        catchError(this.handleError<CalEvent[]>('getCalendarEvents', []))
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
  updateCalendarEvent (calEvent: CalEvent): Observable<CalEvent> {
     // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple PUT requests due to multiple subscriptions.
      let self=this; 
      return this.http.put<CalEvent>(this.calEventsUrl+"/"+calEvent.slug, {calendarEvent: calEvent}) 
        // see this link on why pipe needs to be typed
        // https://stackoverflow.com/questions/52189638/rxjs-v6-3-pipe-how-to-use-it       
        .pipe<null,CalEvent>(
           // Put returns null response
           tap<null>( // Log the result or error
               // res => self.saveEvent(res), 
               //  res => console.log("Calendar Event saved..."),
                _ => {},                                
                error => self.handleError<CalEvent>('updateCalendarEvent')
              ),
           shareReplay<CalEvent>()
        );   
  }
  
  /** GET color schemes from the server */
  
  /* The userid of current user is passed as an optional parameter.  When
     set the default color schemes (i.e. those with no owners) along with
     any colorschemes owned by the passed user is returned.  When user is
     not set, all colorschemes are returned irrespective of owner */
  getColorSchemes (user?: number|string): Observable<ColorScheme[]> {
    let self=this;
    let queryParms="";
    if (user) {
      queryParms="?owner="+user;      
    }
    return this.http.get<GetColorsResponse>(this.colorSchemesUrl+queryParms)
      .pipe(        
        map<GetColorsResponse,ColorScheme[]>(response => { 
            // console.log("response..."+JSON.stringify(response))
            return response.colorSchemes;
        }),
        // tap(colorSchemes => this.log(`fetched color Schemes`)),
        catchError(this.handleError<ColorScheme[]>('getColorSchemes', []))       
      );
  }
  
   /** POST: add a new color scheme to the server */
  addColorScheme (colScheme: ColorScheme): Observable<ColorScheme> {
    return this.http.post<ColorScheme>(this.colorSchemesUrl, colScheme, httpOptions).pipe(
      //tap((colorScheme: ColorScheme) => this.log(`added color Scheme w/ name=${colorScheme.name}`)),
      catchError(this.handleError<ColorScheme>('addColorScheme'))
    );
  }
  
  /** DELETE: delete the color scheme from the server */
  deleteColorScheme (colorScheme: ColorScheme | number): Observable<ColorScheme> {
    const id = typeof colorScheme === 'number' ? colorScheme : colorScheme.id;
    const url = `${this.colorSchemesUrl}/${id}`;

    return this.http.delete<ColorScheme>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted ccolor scheme id=${id}`)),
      catchError(this.handleError<ColorScheme>('deleteColorScheme'))
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
