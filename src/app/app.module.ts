import { NgModule, NO_ERRORS_SCHEMA }       from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { MatMenuModule, MatButtonModule, MatIconModule, MatCardModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

/* it might be safest to import the routing module last */
import { AppRoutingModule }     from './app-routing.module';

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
import { SocialIconsComponent } from './social-icons/social-icons.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { StandardPageComponent } from './standard-page/standard-page.component';

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
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
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
    CarouselExampleComponent,
    SocialIconsComponent,
    PageNotFoundComponent,
    StandardPageComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [TransactionService]
})
export class AppModule { }


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
