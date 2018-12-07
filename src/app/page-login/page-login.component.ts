import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';

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
  returnPage='/'; // for now just redirect to home page
  
  loginHeader : HeaderContent = {
    title: "Sign in to Town of Babylon",
    strapline: ""
  }
  constructor(private authService: AuthService) { }

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
            next(x) { /*console.log('data: ', x);*/ },
            error(err) { self.formError = err.message;
                          console.log('Some error '+err.message); 
                       }
        });
    }

}
