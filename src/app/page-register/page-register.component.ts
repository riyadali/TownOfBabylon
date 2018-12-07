import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';

interface HeaderContent {  
  title: string;
  strapline: string;
};

@Component({
  selector: 'app-page-register',
  templateUrl: './page-register.component.html',
  styleUrls: ['./page-register.component.scss']
})
export class PageRegisterComponent implements OnInit {
  
  formError: string = "";
  credentials = {
    user: {
            username : "",
            email : "",
            password : "",
            bio : ""
          } 
  };
  
  // if you want to redirect to specific page after registering
  // For example you may want to a particular calendar entry.
  //returnPage = $location.search().page || '/'; 
  returnPage='/'; // for now just redirect to home page
  
  registerHeader : HeaderContent = {
    title: "Create a new Town of Babylon account",
    strapline: ""
  }
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  
  onSubmit () {
      this.formError = "";
      if (!this.credentials.user.username || !this.credentials.user.email || !this.credentials.user.password) {
        this.formError = "All fields except bio required, please try again";
        return false;
      } else {
        this.doRegister();
      }
  }
  
  doRegister () {
      this.formError = "";
      let self=this;
      this.authService
        .register(this.credentials)
        .subscribe({
            next(x) { /*console.log('data: ', x);*/ },
            error(err) { self.formError = err.message;
                          console.log('Some error '+err.message); 
                       }
        });
    }

}

