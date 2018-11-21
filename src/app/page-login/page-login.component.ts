import { Component, OnInit } from '@angular/core';

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
  
  loginHeader : HeaderContent = {
    title: "Sign in to Town of Babylon",
    strapline: ""
  }
  constructor() { }

  ngOnInit() {
  }

}
