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
    title: {"Sign in to "};
    strapline: {"Town of Babylon"};
  }
  constructor() { }

  ngOnInit() {
  }

}
