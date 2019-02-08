import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard }  from './auth/auth.guard';

/* imports from the original heroes app ---

import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroesComponent }      from './heroes/heroes.component';
import { TransactionsComponent }      from './transactions/transactions.component';
import { TransactionDetailComponent }  from './transaction-detail/transaction-detail.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';
*/
import { PageNotFoundComponent }   from './page-not-found/page-not-found.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { StandardPageComponent }   from './standard-page/standard-page.component';
import { PageHomeComponent }   from './page-home/page-home.component';
import { PageDoingBusinessInBabylonComponent }   from './page-doing-business-in-babylon/page-doing-business-in-babylon.component';
// sign in route moved to auth routing module
// import { PageLoginComponent }   from './page-login/page-login.component';
// register route moved to auth routing module
// import { PageRegisterComponent } from './page-register/page-register.component';
// import { PageUpdateProfileComponent } from './page-update-profile/page-update-profile.component';



/* routes from the original heroes app ---

const routes: Routes = [
 { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
 { path: 'dashboard', component: DashboardComponent },
 { path: 'detail/:id', component: HeroDetailComponent },
 { path: 'heroes', component: HeroesComponent },
 { path: 'transactionDetail/:id', component: TransactionDetailComponent },
 { path: 'transactions', component: TransactionsComponent },
 
];

you amy also want to add the following path
{ path: '**', component: PageNotFoundComponent }

*/

const routes: Routes = [

  /* another possibility  for static pages from site https://medium.com/@feloy/building-a-static-website-with-angular-universal-a1acc49e26e5
   is to have a page id
     as a parameter as shown below

     RouterModule.forRoot([
       { path: '', component: HomeComponent },
       { path: 'page.html', component: PageComponent },
       ******{ path: 'page/:id', component: PageIdComponent }
     ])

     // page.component.html (main page that references other pages)
        <h2>Page list</h2>
            <ul>
              <li><a [routerLink]="['/page', '1.html']">Page 1</a></li>
              <li><a [routerLink]="['/page', '2.html']">Page 2</a></li>
              <li><a [routerLink]="['/page', '3.html']">Page 3</a></li>
              <li><a [routerLink]="['/page', '4.html']">Page 4</a></li>
            </ul>

     // page-id.component.html
        <h2>Page details</h2>
          Page {{id | async}}
          <app-page></app-page>
          // page-id.component.ts
          import { Component, OnInit } from '@angular/core';
          import { ActivatedRoute } from '@angular/router';
          import { Observable } from 'rxjs/Observable';
          import 'rxjs/add/operator/pluck';
          import 'rxjs/add/operator/map';
          @Component({
          selector: 'app-page-id',
          templateUrl: './page-id.component.html',
          styleUrls: ['./page-id.component.css']
          })
          export class PageIdComponent implements OnInit {
            public id: Observable<string>;
            constructor(private route: ActivatedRoute) { }
            ngOnInit() {
              this.id = this.route.params.pluck('id')
                .map((s: string) => s.replace(/.html$/, ''));
            }

          }
 */



  /* from web site https://alligator.io/angular/lazy-loading/
     basically lazy loads static pages.
     Saves you trouble of defining individual components for each
     staic page.  We'll see how this woprks out in practice>

     Notice the odd-looking syntax with loadChildren: first, the path to the module, then #, followed by the module’s class name. This instructs the router that the module should be lazy loaded and tells it where to find the module.
  */
 { path: '', redirectTo: '/home', pathMatch: 'full' },
 { path: 'home', component: PageHomeComponent, pathMatch: 'full' },
 { path: 'doing_business_in_babylon', component: PageDoingBusinessInBabylonComponent, pathMatch: 'full' },
 // sign in route moved to auth routing module
 // { path: 'sign_in', component: PageLoginComponent, pathMatch: 'full' },
 // register route moved to auth routing module
 // { path: 'register', component: PageRegisterComponent, pathMatch: 'full' },
 
 /*  -- update_profile removed as a route.  This functionality is now supported via a modal dialog
 { 
   path: 'update_profile', 
   component: PageUpdateProfileComponent,
   // Refer to link to preventloading of protected module if not authorized
   // https://angular.io/guide/router#canload-guard-guarding-unauthorized-loading-of-feature-modules
   // Add a CanLoad guard that only loads the AdminModule once the 
   // user is logged in and attempts to access the admin feature area. 
   //canLoad: [AuthGuard],
   canActivate: [AuthGuard],
   pathMatch: 'full' 
 },
 -- end update_profile route removed */
  
 { path: 'standard-page/:id', component: StandardPageComponent },
 { path: 'dashboard', component: DashboardComponent },
  { path: 'static_pages', loadChildren: './static-pages/static-pages.module#StaticPagesModule' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
 /* to enable tracing ...
 If you need to see what events are happening during the navigation lifecycle, there is the enableTracing option as part of the router's default configuration. This outputs each router event that took place during each navigation lifecycle to the browser console. This should only be used for debugging purposes.

  import: [RouterModule.forRoot(routes, {enableTracing: true})]
*/

 imports: [ RouterModule.forRoot(routes) ],
 exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
