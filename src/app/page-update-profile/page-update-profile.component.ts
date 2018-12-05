import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';

interface HeaderContent {  
  title: string;
  strapline: string;
};

@Component({
  selector: 'app-page-update-profile',
  templateUrl: './page-update-profile.component.html',
  styleUrls: ['./page-update-profile.component.scss']
})
export class PageUpdateProfileComponent implements OnInit {
  
  formError: string = "";
  credentials = {
    user: {
            username : "",
            email : "",         
            bio : ""
          } 
  };
  
  // if you want to redirect to specific page after updating profile
  // For example you may want to a particular calendar entry.
  //returnPage = $location.search().page || '/'; 
  // returnPage='/'; // for now just redirect to home page
  
  updateProfileHeader : HeaderContent = {
    title: "Update account profile",
    strapline: ""
  }
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }
  
  onSubmit () {
      this.formError = "";
      if (!this.credentials.user.username || !this.credentials.user.email) {
        this.formError = "All fields except bio required, please try again";
        return false;
      } else {
        this.doUpdate();
      }
  }
  
  doUpdate () {
      this.formError = "";
      this.authService
        .updateProfile(this.credentials)
        .subscribe({
            next(x) { /*console.log('data: ', x);*/ },
            error(err) { this.formError = err.message;
                          console.log('Some error '+err.message); 
                       }
        });
    }

}
