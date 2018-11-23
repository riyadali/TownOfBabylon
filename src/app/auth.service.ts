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
  
  saveToken (token) {
      localStorage.setItem('tob_id_token', token);
  }
  
  getToken () {
      return localStorage.getItem("tob_id_token");
  }
  
  isLoggedIn () {
    var token = this.getToken();

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
          email : payload.email,
          name : payload.name
      };
    }
  }
  
  register (user) { 
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple POST requests due to multiple subscriptions.
      return this.http.post<LoginResultModel>('/api/register', user)
        .do(res => this.saveToken(res.token))
        .shareReplay();      
  }
            
  login (user) {
      // We are calling shareReplay to prevent the receiver of this Observable from accidentally 
      // triggering multiple POST requests due to multiple subscriptions.
      // --- not sure how to incorporate shareReplay ???
      return this.http.post<LoginResultModel>('/api/login', user)        
        .pipe<LoginResultModel>(
           tap( // Log the result or error
                res => this.saveToken(res.token),       
                error => console.log("failure after post "+ error.message)
              )
        )
  }
  
  logout () {
      localStorage.removeItem("tob_id_token");
  }
         
}
