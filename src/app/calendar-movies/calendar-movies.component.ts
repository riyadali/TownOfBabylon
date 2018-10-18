import { Component, ChangeDetectionStrategy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CalendarEvent } from 'angular-calendar';

import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
} from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

interface Film {
  id: number;
  title: string;
  release_date: string;
};


@Component({
  selector: 'app-calendar-movies',
  templateUrl: './calendar-movies.component.html',
 /* animations: [collapseAnimation], */
  styleUrls: ['./calendar-movies.component.scss']
})

export class MyCalendarMoviesComponent implements OnInit {
  
  @ViewChild('dayEventsTemplate')
  dayEventsTemplate: TemplateRef<any>;
  
  locale: string = 'en';
  
  vwMonth: string = 'month';
  vwWeek: string = 'week';
  vwDay: string = 'day';
  
  vw: string = this.vwMonth; /* default view */
  vwDate: Date = new Date();

  events$: Observable<Array<CalendarEvent<{ film: Film }>>>;

  activeDayIsOpen: boolean = false;

  constructor(private http: HttpClient) {}  

  ngOnInit() {
    this.fetchEvents();
  }
  
  fetchEvents(): void {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.vw];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.vw];

    const params = new HttpParams()
      .set(
        'primary_release_date.gte',
        format(getStart(this.vwDate), 'YYYY-MM-DD')
      )
      .set(
        'primary_release_date.lte',
        format(getEnd(this.vwDate), 'YYYY-MM-DD')
      )
      .set('api_key', '0ec33936a68018857d727958dca1424f');

    this.events$ = this.http
      .get('https://api.themoviedb.org/3/discover/movie', { params })
      .pipe(
        map(({ results }: { results: Film[] }) => {
          return results.map((film: Film) => {
            return {
              title: film.title,
              start: new Date(film.release_date + this.getOffset(this.vwDate)),
              color: colors.yellow,
              meta: {
                film
              }
            };
          });
        })
      );
  }
  
  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ film: Film }>>;
  }): void {
    if (isSameMonth(date, this.vwDate)) {
      if (
        (isSameDay(this.vwDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.vwDate = date;
      }
    }
  }
  
  eventClicked(event: CalendarEvent<{ film: Film }>): void {
    window.open(
      `https://www.themoviedb.org/movie/${event.meta.film.id}`,
      '_blank'
    );
  }
  
  getOffset(date: Date): string {
    var timezoneOffset = new Date(date.getTime()).getTimezoneOffset();
    /*const hoursOffset = String(Math.floor(Math.abs(timezoneOffset / 60))).padStart(
        2,
        '0'
      ); */
    var hoursOffset = String(Math.floor(Math.abs(timezoneOffset / 60))).length==1? 
      '0' + String(Math.floor(Math.abs(timezoneOffset / 60))) : 
      String(Math.floor(Math.abs(timezoneOffset / 60)));

    /*const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0')*/
    var minutesOffset = String(Math.abs(timezoneOffset % 60)).length==1? 
      '0' + String(Math.abs(timezoneOffset % 60)) : 
      String(Math.abs(timezoneOffset % 60));
    const direction = timezoneOffset > 0 ? '-' : '+';
    return `T00:00:00${direction}${hoursOffset}${minutesOffset}`;
  }
  
}
