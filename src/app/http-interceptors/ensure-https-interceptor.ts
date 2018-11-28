  /* Notes from https://angular.io/guide/http#immutability
 
  Although interceptors are capable of mutating requests and responses, the 
  HttpRequest and HttpResponse instance properties are readonly, rendering them 
  largely immutable.

  They are immutable for a good reason: the app may retry a request several times 
  before it succeeds, which means that the interceptor chain may re-process the 
  same request multiple times. If an interceptor could modify the original request 
  object, the re-tried operation would start from the modified request rather than 
  the original. Immutability ensures that interceptors see the same request for each 
  try. 
  
  TypeScript will prevent you from setting HttpRequest readonly properties. 
  
  To alter the request, clone it first and modify the clone before passing it to 
  next.handle(). You can clone and modify the request in a single step as shown 
  below.
  */

import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass "secure" request to the next request handler. */
@Injectable()
export class EnsureHttpsInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    // clone request and replace 'http://' with 'https://' at the same time
    const secureReq = req.clone({
      url: req.url.replace('http://', 'https://')
    });
    // send the cloned, "secure" request to the next handler.
    return next.handle(secureReq);   
  }
}
