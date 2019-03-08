import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, shareReplay } from 'rxjs/operators';


import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

import { apiSquarePaymentURL } from './config';

import { SquareProcessPaymentRequest } from './model/SquareProcessPaymentRequest';
import { SquareCheckout } from './model/SquareCheckout';

interface CheckoutResponse {
  checkout:  SquareCheckout;  
}

@Injectable({ providedIn: 'root' })
export class SquarePaymentService {

  private squarePaymentProcessPaymentUrl = apiSquarePaymentURL+"transactions/process-payment";  // URL to web api that will interface with square's payment processor
  private squareCheckoutUrl = apiSquarePaymentURL+"checkout/process-checkout";  // URL to web api that will interface with square's chout order flow
  private squareCatalogUrl = apiSquarePaymentURL+"catalog/";  // URL to web api that will interface with square's catalog
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  
  //////// Read methods //////////

  /** GET: List items from the catalog */
  listCatalog (catalogTypes: string): Observable<any> {
    let self=this;
    //console.log('In listCatalog')
    const params = new HttpParams()
      .set('types', catalogTypes);
      //.set('limitToFirst', "1");
    return this.http.get(this.squareCatalogUrl+"list-catalog", {params}).pipe(
      /*
      map<PostEventResponse,CalEvent>(response => { 
          // console.log("response..."+JSON.stringify(response))
         return self.createCalendarEvent(response.calendarEvent);
        }), 
      */
      //tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      // tap(x => self.log(`Catalog List completed. Response is `+ JSON.stringify(x))),
      
      catchError(this.handleError<any>('listCatalog',{}))
    );
  }

  
  //////// Save methods //////////
  
  /** POST: Process a payment request */
  processPayment (payment: SquareProcessPaymentRequest): Observable<any> {
    let self=this;
    return this.http.post(this.squarePaymentProcessPaymentUrl, payment, httpOptions).pipe(
      /*
      map<PostEventResponse,CalEvent>(response => { 
          // console.log("response..."+JSON.stringify(response))
         return self.createCalendarEvent(response.calendarEvent);
        }), 
      */
      //tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      // tap(x => this.log(`Processed payment. Response is `+ JSON.stringify(x))),
      
      catchError(this.handleError<any>('processPayment',{}))
    );
  }

  /** POST: Process a checkout request */
  // note may want to type order more definitively at some point
  processCheckout (checkout: SquareCheckout): Observable<string> {
    let self=this;
    return this.http.post<CheckoutResponse>(this.squareCheckoutUrl, checkout, httpOptions).pipe(
      /*
      map<PostEventResponse,CalEvent>(response => { 
          // console.log("response..."+JSON.stringify(response))
         return self.createCalendarEvent(response.calendarEvent);
        }), 
      */
      //tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      // tap(x => this.log(`Processed payment. Response is `+ JSON.stringify(x))),
      // tap(x => this.log(`Processed checkout. Checkout URL is `+ x.checkout.checkout_page_url)),
      map<CheckoutResponse,string>(x => { 
          // console.log("response..."+JSON.stringify(response))
         return x.checkout.checkout_page_url;
      }),
      
      catchError(this.handleError<any>('processCheckout',{}))
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
    this.messageService.add('SquarePaymentService: ' + message);
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
