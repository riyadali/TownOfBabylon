import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CalEvent } from '../calevent';
import { CalEventService } from '../cal-event.service';

import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import { collapseAnimation } from 'angular-calendar'; /* refer to 
    https://github.com/mattlewis92/angular-calendar/issues/747 */

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  addHours,
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

/* Matt Lewis uses this approach in his code here 
   https://mattlewis92.github.io/angular-calendar/#/additional-event-properties */
interface ExtraEventData {   
   curDay : Date
}

import modalTemplate from "../modal-views/modal.template.html";
import editEventTemplate from "../modal-views/edit-event.template.html";
import mainTemplate from "./calendar-editable.component.html";

@Component({
  selector: 'app-calendar-editable',
 // templateUrl: './calendar-editable.component.html',
  template: modalTemplate+mainTemplate+editEventTemplate,
  animations: [collapseAnimation],
  styleUrls: ['./calendar-editable.component.scss']
})

export class MyCalendarEditableComponent implements OnInit {
  
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;
  
  @ViewChild('dayEventsTemplate')
  dayEventsTemplate: TemplateRef<any>;
  
  @ViewChild('editEventContent')
  editEventContent: TemplateRef<any>;
  
  modalRef: BsModalRef;
  
 // locale: string = 'en';
  
  vwMonth: string = 'month';
  vwWeek: string = 'week';
  vwDay: string = 'day';
  
  /* vwClicked is generally the same as vw except when there are multiple variations
  of a specific view. In this case, vw would identify the acutual view (either 'month', 'week' or 'day') and vwClicked would identify the particular variation (for ex 'weekdays') */
  vwClicked: string = CalendarView.Month; /* default view */
  vw: string = this.vwMonth; /* default view */
  vwDate: Date = new Date();

  //events$: Observable<Array<CalendarEvent<ExtraEventData>>>;
  evnts: Array<CalendarEvent<ExtraEventData>>;

  activeDayIsOpen: boolean = false; /* need to set to false initially since
                                        you don't know if any events exist 
                                        for "today" */
  
  modalData: {
    bodyTemplate: TemplateRef<any>;
    header: string;
    button1Text: string;
    button2Text?: string;
    action: string;
    event: CalendarEvent<ExtraEventData>;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
        this.handleEvent('Edited', event, "Edit an Event", this.editEventContent, "Submit");
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
        this.events$ = this.events$.filter(iEvent => iEvent !== event);
        this.activeDayIsOpen=false; // may have deleted all events for current day
        this.handleEvent('Deleted', event, "Delete an Event", this.editEventContent, "OK", "Cancel");
      }
    }
  ];
    
  events$: CalendarEvent[];

  constructor(private calEventService: CalEventService, private modalService: BsModalService, private http: HttpClient) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  ngOnInit() {
    /*this.fetchEvents();*/
    this.getCalendarEvents();
  }
  
  private createCalendarEvent(cevent : CalEvent) : CalendarEvent<ExtraEventData> {
       
      return { ...cevent,
               actions: this.actions,
               meta: {  
                      curDay: new Date()
                     }  
      };
  }
  
  getCalendarEvents(): void {
    let self=this;
    this.calEventService.getCalendarEvents()
    .subscribe(calEvents => this.events$ = calEvents.map(x=>self.createCalendarEvent(x)));
  }
  
  handleEvent(action: string, event: CalendarEvent<ExtraEventData>, header: string, 
               bodyTemplate: TemplateRef<any>, button1Text: string, button2Text?: string): void {
    if (button2Text)
      this.modalData = { bodyTemplate, header, button1Text, button2Text, event, action };
    else
       this.modalData = { bodyTemplate, header, button1Text, event, action };
    this.openModal(this.modalContent);
  }
  
  /*
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
  */
  
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
  
}
