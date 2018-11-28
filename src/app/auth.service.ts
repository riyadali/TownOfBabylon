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
    console.log('saveToken token is....'+token);
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
    if(this.isLoggedIn()){
      var token = this.getToken();
      var payload = JSON.parse(atob(token.split('.')[1]));
      return {
           user: {
           //   email : payload.email, -- email not in payload just username and id
              name : payload.username
           }
      };
    }
  }
  
  register (user) { 
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple POST requests due to multiple subscriptions.
      return this.http.post<LoginResultModel>('/api/register', user)
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
