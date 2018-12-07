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
import { HeaderModule } from './header.module';

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
import { AuthService } from './auth/auth.service';

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
// import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { NavbarBrandComponent } from './navbar-brand/navbar-brand.component';

import {MyCalendarComponent} from './calendar/calendar.component';
import {MyCalendarMoviesComponent} from './calendar-movies/calendar-movies.component';

/* To include Matt Lewis calendar -- refer to site https://github.com/mattlewis92/angular-calendar */
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';




import { PageHomeComponent } from './page-home/page-home.component';
import { PageDoingBusinessInBabylonComponent } from './page-doing-business-in-babylon/page-doing-business-in-babylon.component';
// LoginComponent moved to AuthModule
// import { PageLoginComponent } from './page-login/page-login.component';
import { PageRegisterComponent } from './page-register/page-register.component';
import { PageUpdateProfileComponent } from './page-update-profile/page-update-profile.component';


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
    HeaderModule,
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

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false, passThruUnknownUrl: true }
    )
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
    MyCalendarMoviesComponent,

    
    
    PageHomeComponent,
    PageDoingBusinessInBabylonComponent,
    // LoginComponent moved to AuthModule
    // PageLoginComponent,
    PageRegisterComponent,
    PageUpdateProfileComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [TransactionService, SearchService, AuthService, httpInterceptorProviders]
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
