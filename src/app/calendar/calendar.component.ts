import { Component, OnInit, EventEmitter } from '@angular/core';
import { CalendarEvent, DAYS_OF_WEEK } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class MyCalendarComponent implements OnInit {
  
  vwMonth: string = 'month';
  vwWeek: string = 'week';
  vwDay: string = 'day';

  vwDate: Date = new Date();
  
  vwDateChange: EventEmitter<Date> = new EventEmitter();

  evnts: CalendarEvent[] = [];

  exclDays: number[] = [0, 6];

  wkStartsOn = DAYS_OF_WEEK.TUESDAY;
  
  constructor() { }

  ngOnInit() {
  }

}

