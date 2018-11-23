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
      email : "",
      password : ""
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
  
  onSubmit function () {
      this.formError = "";
      if (!this.credentials.email || !this.credentials.password) {
        this.formError = "All fields required, please try again";
        return false;
      } else {
        this.doLogin();
      }
  }
  
  doLogin function() {
      this.formError = "";
      authentication
        .login(this.credentials)
        .error(function(err){
          this.formError = err;
        })
        .then(function(){
          // do something here
        });
    };

}
