import { Component, OnInit, EventEmitter } from '@angular/core';
import { CalendarEvent, DAYS_OF_WEEK, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class MyCalendarComponent implements OnInit {
  
  vw: CalendarView = CalendarView.Month;
  vwMonth: string = 'month';
  vwWeek: string = 'week';
  vwDay: string = 'day';
  vwSDay: string = 'sDay';

  vwDate: Date = new Date();
  
  vwDateChange: EventEmitter<Date> = new EventEmitter();

  evnts: CalendarEvent[] = [];

  exclDays: number[] = [0, 6];

  wkStartsOn = DAYS_OF_WEEK.TUESDAY;
  
  constructor() { }

  ngOnInit() {
  }

}

