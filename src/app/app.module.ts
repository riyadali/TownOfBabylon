/* Installation instructions for angular-bootstrap-md indicates to
add NO_ERROR_SCHEMA.  However, this does not seem like a good idea because
it masks potential errors.  Hence I'm not longer using  NO_ERRORS_SCHEMA */
/* import { NgModule, NO_ERRORS_SCHEMA }       from '@angular/core'; */

import { NgModule }       from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule,  ReactiveFormsModule }    from '@angular/forms';

import { Router } from '@angular/router';

// page header component moved to separate module because it
// is being shared by app.module as well as auth.module
import { AppCommonModule } from './common.module';

import {Globals} from  './shared/app.global';  // for shared variables

/* Because interceptors are (optional) dependencies of the HttpClient service, you 
   must provide them in the same injector (or a parent of the injector) that provides HttpClient. 
   Interceptors provided after DI creates the HttpClient are ignored.

   This app provides HttpClient in the app's root injector, as a side-effect of importing the 
   HttpClientModule in AppModule. You should provide interceptors in AppModule as well. */
import { HttpClientModule }    from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'; /* ngx-bootstrap dropdown package see https://valor-software.com/ngx-bootstrap/#/dropdowns#usage*/
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatMenuModule, MatButtonModule, MatIconModule, MatCardModule, MatSidenavModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule } from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs'; /* for tabs on web page */
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';
import { SearchService } from './search.service';
import { CalEventService } from './cal-event.service';
import { AuthService } from './auth/auth.service';
import { ModalService } from './modal.service';
import { DomService } from './dom.service';

import { httpInterceptorProviders } from './http-interceptors/index';

/* it might be safest to import the routing module last */
import { AppRoutingModule }     from './app-routing.module';

import { AuthModule }           from './auth/auth.module'; 

import { AppComponent }         from './app.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { HeroSearchComponent }  from './hero-search/hero-search.component';
import { MessagesComponent }    from './messages/messages.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';
import { TransactionService } from './transaction.service';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { CarouselExampleComponent } from './carousel-example/carousel-example.component';
import { SocialIconComponent } from './social-icon/social-icon.component';  /* in navbar */
import { SocialIconsComponent } from './social-icons/social-icons.component'; /* in footer */
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StandardPageComponent } from './standard-page/standard-page.component';

import { ToolBarScalableComponent } from './tool-bar-scalable/tool-bar-scalable.component';
// page header component moved to separate module because it
// is being shared by app.module as well as auth.module
// *** discovered that header component was more trouble than its worth when used in pagelogin
// *** so just updated pagelogin's html to remove need for header
// *** But for now leaving header component in AppCommonModule 
// *** because may want to use appcommon for other shared components
// import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { NavbarBrandComponent } from './navbar-brand/navbar-brand.component';

import {MyCalendarComponent} from './calendar/calendar.component';
import {MyCalendarEditableComponent} from './calendar-editable/calendar-editable.component';
import {MyCalendarMoviesComponent} from './calendar-movies/calendar-movies.component';

/* To include Matt Lewis calendar -- refer to site https://github.com/mattlewis92/angular-calendar */
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

/* owldatetime picker -- see http://www.lib4dev.com/info/DanielYKPan/date-time-picker/74739830 
                         and also https://daniel-projects.firebaseapp.com/owlng/date-time-picker 
                         code is here https://github.com/DanielYKPan/owl-examples/tree/date-time-picker*/
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


import { PageHomeComponent } from './page-home/page-home.component';
import { PageDoingBusinessInBabylonComponent } from './page-doing-business-in-babylon/page-doing-business-in-babylon.component';
// Because PageLoginComponent is loaded dynamically into the modal dialog,
// it is imported and defined as an entryComponent in app.module.ts.
// Refer to example in https://itnext.io/angular-create-your-own-modal-boxes-20bb663084a1
import { PageLoginComponent } from './page-login/page-login.component';
import { PageRegisterComponent } from './page-register/page-register.component';
import { PageUpdateProfileComponent } from './page-update-profile/page-update-profile.component';

// various payment processors
import { NgxPayPalModule } from 'ngx-paypal';
import { PayPalComponent } from './payment/paypal/paypal.component';

import { PaymentSquareComponent } from './payment/payment-square/payment-square.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCardModule,
    MatSidenavModule, 
    MatToolbarModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatAutocompleteModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
// *** discovered that header component was more trouble than its worth when used in pagelogin
// *** so just updated pagelogin's html to remove need for header
// *** But for now leaving header component in AppCommonModule 
// *** because may want to use appcommon for other shared components
    AppCommonModule,
    AuthModule,
    AppRoutingModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(), /* ngx-bootstrap modal */
    MDBBootstrapModule.forRoot(),
    
    CalendarModule.forRoot({  /* To include Matt Lewis calendar */
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    
    /* owldatetime picker -- see http://www.lib4dev.com/info/DanielYKPan/date-time-picker/74739830 
                         and also https://daniel-projects.firebaseapp.com/owlng/date-time-picker 
                         code is here https://github.com/DanielYKPan/owl-examples/tree/date-time-picker*/
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false, passThruUnknownUrl: true }
    ),
    
    // various payment processors
    NgxPayPalModule
  ],
  /* schemas: [ NO_ERRORS_SCHEMA ], */
  schemas: [ ],
  declarations: [
    AppComponent,
    DashboardComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent,
    TransactionsComponent,
    TransactionDetailComponent,
    MainMenuComponent,
    SideNavComponent,
    ToolBarComponent,
    ToolBarScalableComponent,
    // page header component moved to separate module because it
    // is being shared by app.module as well as auth.module
    // *** discovered that header component was more trouble than its worth when used in pagelogin
    // *** so just updated pagelogin's html to remove need for header
    // *** But for now leaving header component in AppCommonModule 
    // *** because may want to use appcommon for other shared components
    // HeaderComponent,
    FooterComponent,
    SearchFormComponent,
    NavbarBrandComponent,
    CarouselExampleComponent,
    SocialIconsComponent,
    SocialIconComponent,
    PageNotFoundComponent,
    StandardPageComponent,
    
    MyCalendarComponent,
    MyCalendarEditableComponent,
    MyCalendarMoviesComponent,

    
    
    PageHomeComponent,
    PageDoingBusinessInBabylonComponent,
    // LoginComponent moved to AuthModule
    // PageLoginComponent, (now defined in entryComponent)
    // PageRegisterComponent, (now defined in entryComponent)
    PageUpdateProfileComponent,
    
    // various payment component
    PayPalComponent,
    PaymentSquareComponent
  ],
  // Because PageLoginComponent and PageRegisterComponent are loaded dynamically into the modal dialog,
  // they are imported and defined as entryComponent in app.module.ts.
  // Refer to example in https://itnext.io/angular-create-your-own-modal-boxes-20bb663084a1
  entryComponents: [PageLoginComponent, PageRegisterComponent, PageUpdateProfileComponent],
  bootstrap: [ AppComponent ],
  providers: [ TransactionService, { provide: 'Window', useValue: window }, SearchService, CalEventService, AuthService, 
                ModalService, DomService, httpInterceptorProviders, Globals]
})
export class AppModule {
  
  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    // Use a custom replacer to display function names in the route configs
    // const replacer = (key, value) => (typeof value === 'function') ? value.name : value;

    // console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }
  
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
