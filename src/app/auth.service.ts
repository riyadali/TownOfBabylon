import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginResultModel} from './model/LoginResultModel'

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
  
  saveToken function (token) {
      localStorage.setItem('tob_id_token', token);
  }
  
  getToken function () {
      return localStorage.getItem("tob_id_token");
  }
  
  isLoggedIn function() {
    var token = getToken();

    if(token){
      var payload = JSON.parse(atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
  
  currentUser function() {
    if(isLoggedIn()){
      var token = getToken();
      var payload = JSON.parse(atob(token.split('.')[1]));
      return {
          email : payload.email,
          name : payload.name
      };
    }
  }
  
  register function(user) { 
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple POST requests due to multiple subscriptions.
      return this.http.post<LoginResultModel>('/api/register', user)
        .do(res => this.saveToken(res.token))
        .shareReplay();      
  }
            
  login function(user) {
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple POST requests due to multiple subscriptions.
      return this.http.post<LoginResultModel>('/api/login', user)
        .do(res => this.saveToken(res.token))
        .shareReplay();  
  }
  
  logout function() {
      localStorage.removeItem("tob_id_token");
  }
         
}
