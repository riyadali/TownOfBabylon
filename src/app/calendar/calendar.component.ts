import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class MyCalendarComponent implements OnInit {
  
  vw: string = 'month';

  vwDate: Date = new Date();

  evnts: CalendarEvent[] = [];
  
  constructor() { }

  ngOnInit() {
  }

}

