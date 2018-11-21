import { Component, OnInit } from '@angular/core';

interface HeaderContent {  
  title: string;
  strapline: string;
};
@Component({
  selector: 'app-page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  @Input()
  content: HeaderContent;

  constructor() { }

  ngOnInit() {
  }

}
