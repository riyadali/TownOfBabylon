import { Component, OnInit } from '@angular/core';
import { CalendarEvent, DAYS_OF_WEEK } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class MyCalendarComponent implements OnInit {
  
  vw: string = 'month';

  vwDate: Date = new Date();

  evnts: CalendarEvent[] = [];

  exclDays: number[] = [0, 6];

  wkStartsOn = DAYS_OF_WEEK.TUESDAY;
  
  constructor() { }

  ngOnInit() {
  }

}

