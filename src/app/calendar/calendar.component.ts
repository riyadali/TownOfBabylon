import { Component, OnInit, EventEmitter } from '@angular/core';
import { CalendarEvent, DAYS_OF_WEEK, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class MyCalendarComponent implements OnInit {
  
  vw: CalendarView = CalendarView.Month; /* default view */
  
  /* vwClicked is generally the same as vw except when there are multiple variations
  of a specific view. In this case, vw would identify the acutual view (either 'month', 'week' or 'day') and vwClicked would identify the particular variation (for ex 'weekdays') */
  vwClicked: string = CalendarView.Month; /* default view */
  
  vwMonth: string = 'month';
  vwWeek: string = 'week';
  vwDay: string = 'day';
  vwWDay: string = 'wDay'; /* work day */

  vwDate: Date = new Date();
  
  vwDateChange: EventEmitter<Date> = new EventEmitter();

  evnts: CalendarEvent[] = [];

  exclDays: number[] = [0, 6];

  wkStartsOn = DAYS_OF_WEEK.TUESDAY;
  
  constructor() { }

  ngOnInit() {
  }

}

