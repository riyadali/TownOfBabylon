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
  private squareLocationsUrl = apiSquarePaymentURL+"locations/";  // URL to web api that will interface with square's catalog
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }
  
  //////// Read methods //////////
  
  /** GET: List of locations */
  listLocations (): Observable<any> {
    let self=this;
    return this.http.get(this.squareLocationsUrl).pipe(
      /*
      map<PostEventResponse,CalEvent>(response => { 
          // console.log("response..."+JSON.stringify(response))
         return self.createCalendarEvent(response.calendarEvent);
        }), 
      */
      //tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      // tap(x => self.log(`Catalog List completed. Response is `+ JSON.stringify(x))),
      
      catchError(this.handleError<any>('listLocations',{}))
    );
  }

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
  
  /** Query Catalog */
  // Query supports many query types such as: CatalogQuerySortedAttribute, CatalogQueryExact, CatalogQueryRange, 
  // CatalogQueryText, CatalogQueryItemsForTax, and CatalogQueryItemsForModifierList.
  //
  // You can find documentation of how to set up the query by starting here 
  // https://docs.connect.squareup.com/api/connect/v2#type-catalogquery
  // For example a prefix query is documented here https://docs.connect.squareup.com/api/connect/v2#type-catalogqueryprefix
 
  // The following catalog search functions are basically variations of the catalog search api using one of the query types 
  // identified above.  The catalog search api is documented here
  // https://docs.connect.squareup.com/api/connect/v2#endpoint-catalog-searchcatalogobjects
  
  /* Find objects whose name matches with passed search string  */
  findCatalogObjectsByName (searchName: string, searchTypes: string[]): Observable<any> {
    let self=this;
    //console.log("in find catalog")
    let searchRequest = {
      object_types: searchTypes,
      query: {
  	    exact_query: {
          attribute_name: "name",
          attribute_value: searchName
        }
      },
      limit: 100
    };
    
    return this.http.post(this.squareCatalogUrl+"search", searchRequest, httpOptions).pipe(    
      /*
      map<PostEventResponse,CalEvent>(response => { 
          // console.log("response..."+JSON.stringify(response))
         return self.createCalendarEvent(response.calendarEvent);
        }), 
      */
      //tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      // tap(x => self.log(`Catalog search completed. Response is `+ JSON.stringify(x))),
      
      catchError(this.handleError<any>('findCatalogObjectByName',{}))
    );
  }
  
  /* Find objects whose name starts with passed prefix  */
  findCatalogObjectsByPrefix (searchPrefix: string, searchTypes: string[]): Observable<any> {
    let self=this;
    //console.log("in find catalog")
    let searchRequest = {
      object_types: searchTypes,
      query: {
  	    prefix_query: {
          attribute_name: "name",
          attribute_prefix: searchPrefix
        }
      },
      limit: 100
    };
    
    return this.http.post(this.squareCatalogUrl+"search", searchRequest, httpOptions).pipe(    
      /*
      map<PostEventResponse,CalEvent>(response => { 
          // console.log("response..."+JSON.stringify(response))
         return self.createCalendarEvent(response.calendarEvent);
        }), 
      */
      //tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      //tap(x => self.log(`Catalog search completed. Response is `+ JSON.stringify(x))),
      
      catchError(this.handleError<any>('findCatalogObjectByPrefix',{}))
    );
  }
  
  /* Find objects that has all of the passed keywords as prefixes in its searchable fields  
     For example, if a CatalogItem contains attributes {"name": "t-shirt"} and {"description": "Small, Purple"}, 
     it will be matched by the query {"keywords": ["shirt", "sma", "purp"]}.
     Keywords with fewer than 3 chars are ignored -- in practice it appears that fewer than 2 chars ignored.
     Note: 1 to 3 keywords allowed.
     Note: the name field is searched.  Description and abbreviation also searched if it is an ITEM.
           SKU, UPC and user-data (metadata) also searched if description is an ITEM_VARIATION.
  */
  findCatalogObjectsByKeywords(searchKeywords: string[], searchTypes: string[]): Observable<any> {
    let self=this;
    //console.log("in find catalog")
    let searchRequest = {
      object_types: searchTypes,
      query: {
  	    text_query: {
          keywords: searchKeywords
        }
      },
      limit: 100
    };
    
    return this.http.post(this.squareCatalogUrl+"search", searchRequest, httpOptions).pipe(    
      /*
      map<PostEventResponse,CalEvent>(response => { 
          // console.log("response..."+JSON.stringify(response))
         return self.createCalendarEvent(response.calendarEvent);
        }), 
      */
      //tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      //tap(x => self.log(`Catalog search completed. Response is `+ JSON.stringify(x))),
      
      catchError(this.handleError<any>('findCatalogObjectByPrefix',{}))
    );
  }
  
  /* Get sorted list of objects from the catalog.
     sortOrder can either be "ASC" or "DESC". It defaults to "ASC".
     If initialValue is specified, ascending sorts will return only objects with this value or greater, 
     while descending sorts will return only objects with this value or less. 
  */
  getCatalogObjectsSortedByName(getTypes: string[], initialValue?: string, sortOrder?: string): Observable<any> {
    let self=this;    
    let searchRequest = {
      object_types: getTypes,
      query: {
  	    sorted_attribute_query: {
          attribute_name: "name",
          initial_attribute_value: "", // default is no initial value
          sort_order: "ASC" // default order is ascending
        }
      },
      limit: 100
    };

    if (sortOrder&&sortOrder.toLowerCase()!="ASC".toLowerCase()) {
       searchRequest.query.sorted_attribute_query.sort_order=sortOrder.toUpperCase();
    }

    if (initialValue) {
       searchRequest.query.sorted_attribute_query.initial_attribute_value=initialValue;
    }
    
    return this.http.post(this.squareCatalogUrl+"search", searchRequest, httpOptions).pipe(    
      /*
      map<PostEventResponse,CalEvent>(response => { 
          // console.log("response..."+JSON.stringify(response))
         return self.createCalendarEvent(response.calendarEvent);
        }), 
      */
      //tap((calEvent: CalEvent) => this.log(`added calendar event w/ id=${calEvent.id}`)),
      //tap(x => self.log(`Catalog search completed. Response is `+ JSON.stringify(x))),
      
      catchError(this.handleError<any>('findCatalogObjectByPrefix',{}))
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
