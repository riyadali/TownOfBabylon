import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';

import {
  Router
 // CanActivate,
 // ActivatedRouteSnapshot,
 // RouterStateSnapshot,
 // CanActivateChild,
 // NavigationExtras,
 // CanLoad, Route
}  from '@angular/router';

interface HeaderContent {  
  title: string;
  strapline: string;
};

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit {
  
  formError: string = "";
  credentials = {
    user: {
            email : "",
            password : ""
          } 
  };
  
  // if you want to redirect to specific page after registering
  // For example you may want to a particular calendar entry.  
  //returnPage = $location.search().page || '/'; 
  //returnPage='/'; // for now just redirect to home page
  // The above is from the getting mean site (it may still be useful)
  // However, for now I use the redirectURL in authService to control redirection)
  
  
  loginHeader : HeaderContent = {
    title: "Town of Babylon",
    strapline: ""
  }
  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit() {
  }
  
  onSubmit () {
      this.formError = "";
      if (!this.credentials.user.email || !this.credentials.user.password) {
        this.formError = "All fields required, please try again";
        return false;
      } else {
        this.doLogin();
      }
  }
  
  doLogin () {
      this.formError = "";
      let self=this;
      this.authService
        .login(this.credentials)
        .subscribe({
            next(x) { /*console.log('data: ', x);*/ 
                       if (self.authService.isLoggedIn()) {
                          // Get the redirect URL from our auth service
                          // If no redirect has been set, use the default
                          // let redirect = this.authService.redirectUrl ?      this.authService.redirectUrl : '/admin';
                          let redirect = self.authService.redirectUrl ? 
                                            self.authService.redirectUrl : '/home';

                          // Set our navigation extras object
                          // that passes on our global query params and fragment

                          // Notes on preserveFragment
                          // Preserve fragment from /results#top to /view#top
                          // this.router.navigate(['/view'], { preserveFragment: true });
                          // let navigationExtras: NavigationExtras = {
                          //  queryParamsHandling: 'preserve',
                          //  preserveFragment: true
                          // };

                          // Redirect the user
                          // self.router.navigate([redirect], navigationExtras);
                          self.router.navigate([redirect]);
                        }
                    },
            error(err) { self.formError = err.message;
                          console.log('Some error '+err.message); 
                       }
        });
    }

}
