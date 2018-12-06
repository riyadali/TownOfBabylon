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
  formInfo: string = "";
  credentials = {
    user: {
            username : "",
            email : "",         
            bio : ""
          } 
  };
  
  profile = {
              username : "",
              email : "",         
              bio : ""
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
    this.getProfile();
  }
  
  onSubmit () {
      this.formError = "";
      this.formInfo = "";
      if (!this.credentials.user.username || !this.credentials.user.email) {
        this.formError = "All fields except bio required, please try again";
        return false;
      } else {
        this.doUpdate();
      }
  }
  
  doUpdate () {
      // update only necessary if something changed
      if (this.profile.username!==this.credentials.user.username ||
          this.profile.email!==this.credentials.user.email ||
          this.profile.bio!==this.credentials.user.bio
          ) {
            this.formError = "";
            this.formInfo = "";
            let self=this;
            this.authService
              .updateProfile(this.credentials.user, this.profile) 
              .subscribe({
                  next(x) { /*console.log('data: ', x);*/ 
                            self.formInfo= "Profile updated successfully";
                  },
                  error(err) { self.formError = err.message;
                                console.log('Some error '+err.message); 
                             }
              });

          } else {
            this.formInfo= "Profile updated successfully";  
          }    
  }
  
  getProfile () {    
      this.formError = "";
      this.formInfo = "";
      let self=this;
      this.authService
        .getProfile(this.profile)
        .subscribe({
            next(x) { /*console.log('data: ', x);*/ 
                      self.credentials.user.username=self.profile.username;
                      self.credentials.user.email=self.profile.email;
                      self.credentials.user.bio=self.profile.bio;
                    },
            error(err) { self.formError = err.message;
                          console.log('Error getting profile... '+err.message); 
                       }
        });
  }

}
