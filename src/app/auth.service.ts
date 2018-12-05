import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import {LoginResultModel} from './model/LoginResultModel';
import {apiURL} from './config';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {}
   
  // angular university - https://blog.angular-university.io/angular-jwt-authentication/ - uses the following method
  //  login(email:string, password:string ) {
  //      return this.http.post<User>('/api/login', {email, password})
  //          .do(res => this.setSession) 
  //          .shareReplay();
  //  }
  //private setSession(authResult) {
  //      const expiresAt = moment().add(authResult.expiresIn,'second');

  //      localStorage.setItem('id_token', authResult.idToken);
  //      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  //}    
  
  saveToken (token) {
      localStorage.setItem('tob_id_token', token);
      // console.log('saveToken token is....'+token);
  }
  
  getToken () {
      return localStorage.getItem("tob_id_token");
  }
  
  isLoggedIn () {
    var token = this.getToken();
    /* the console write below is indicating that this routine is being called regularly.
       The template for tool-bar-scalable checks isLoggedIn before displaying the sigin button.
       Maybe there is no way around this because you need to check regularly in case some action
       causes the user to be logged out.  But this means that this routine will need to be super
       efficient.  Let's hope so since it reparses the token every single time. */
    
    //console.log('isloggedIn token is....'+token)

    if(token){
      var payload = JSON.parse(atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
  
  currentUser () {
    /* since currentUser() is also referenced in template, comments regarding efficiency from
       isLoggedIn() also apply */
    if(this.isLoggedIn()){
      var token = this.getToken();
      var payload = JSON.parse(atob(token.split('.')[1]));
      return {
           user: {
           //  email : payload.email, -- email not in payload just username and id
           //  if you need to update payload the server code would need to be updated
           //  you can find it here node-express-realworld-example-app/blob/master/models/User.js in
           //  my node-express-realword repository.  I'm not sure if this is the only change needed
              name : payload.username
           }
      };
    }
  }
  
  register (user) { 
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple POST requests due to multiple subscriptions.
      return this.http.post<LoginResultModel>(apiURL+'users', user)
        // see this link on why pipe needs to be typed
        // https://stackoverflow.com/questions/52189638/rxjs-v6-3-pipe-how-to-use-it       
        .pipe<LoginResultModel,LoginResultModel>(          
           tap<LoginResultModel>( // Log the result or error
                res => this.saveToken(res.user.token),       
                error => console.log("failure after post "+ error.message)
              ),
           shareReplay<LoginResultModel>()
        );   
  }
  
  // gets user profile associated with current authorization token (from prior login)
  getProfile (profile) { 
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple GET requests due to multiple subscriptions.
      if(this.isLoggedIn()){
        return this.http.get<LoginResultModel>(apiURL+'user') 
          // see this link on why pipe needs to be typed
          // https://stackoverflow.com/questions/52189638/rxjs-v6-3-pipe-how-to-use-it       
          .pipe<LoginResultModel,LoginResultModel>(          
            tap<LoginResultModel>( // Log the result or error
                res => this.saveProfile(res.user,profile),       
                error => console.log("failure on http get profile "+ error.message)
              ),
            shareReplay<LoginResultModel>()
          );   
      }
  }
  
  // save profile from user data returned in response 
  saveProfile (user, profile) {
      profile.email = user.email;
      profile.bio = user.bio;
      profile.username = user.username; 
  }
  
 // updates user profile associated with current authorization token (from prior login)
 updateProfile (user) { 
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple POST requests due to multiple subscriptions.
      return this.http.pst<LoginResultModel>(apiURL+'users', user) // needs updating ?????
        // see this link on why pipe needs to be typed
        // https://stackoverflow.com/questions/52189638/rxjs-v6-3-pipe-how-to-use-it       
        .pipe<LoginResultModel,LoginResultModel>(          
           tap<LoginResultModel>( // Log the result or error
                res => this.saveToken(res.user.token),       
                error => console.log("failure after post "+ error.message)
              ),
           shareReplay<LoginResultModel>()
        );   
  }
            
  login (user) {
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple POST requests due to multiple subscriptions.      
      return this.http.post<LoginResultModel>(apiURL+'users/login', user)        
        // see this link on why pipe needs to be typed
        // https://stackoverflow.com/questions/52189638/rxjs-v6-3-pipe-how-to-use-it       
        .pipe<LoginResultModel,LoginResultModel>(          
           tap<LoginResultModel>( // Log the result or error
                res => this.saveToken(res.user.token),       
                error => console.log("failure after post "+ error.message)
              ),
           shareReplay<LoginResultModel>()
        );   
  }
  
  logout () {
      localStorage.removeItem("tob_id_token");
  }
         
}
