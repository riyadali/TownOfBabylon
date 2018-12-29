import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CalEvent } from '../calevent';
import { CalEventService } from '../cal-event.service';

import { AuthService } from '../auth/auth.service';

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
   description? : string;
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
  private modalContent: TemplateRef<any>;
  
  @ViewChild('dayEventsTemplate')
  private dayEventsTemplate: TemplateRef<any>;
  
  @ViewChild('editEventContent')
  private editEventContent: TemplateRef<any>;
  
  // Controls refresh of display after changes have been made to events
  private refresh: Subject<any> = new Subject();
  
  private formError: string = ""; // used in modal forms
  // formInfo: string = ""; // used in modal forms
  
  private modalRef: BsModalRef;
  
 // locale: string = 'en';
 private dateClicked: Date;
  
  private vwMonth: string = 'month';
  private vwWeek: string = 'week';
  private vwDay: string = 'day';
  
  /* vwClicked is generally the same as vw except when there are multiple variations
  of a specific view. In this case, vw would identify the acutual view (either 'month', 'week' or 'day') and vwClicked would identify the particular variation (for ex 'weekdays') */
  private vwClicked: string = CalendarView.Month; /* default view */
  private vw: string = this.vwMonth; /* default view */
  private vwDate: Date = new Date();

  private curEvent: CalendarEvent<ExtraEventData>; // currently selected event
  //events$: Observable<Array<CalendarEvent<ExtraEventData>>>;
  private evnts: Array<CalendarEvent<ExtraEventData>>;

  private activeDayIsOpen: boolean = false; /* need to set to false initially since
                                        you don't know if any events exist 
                                        for "today" */
  
  private modalData: {
    bodyTemplate: TemplateRef<any>;
    header: string;
    button1Text: string;
    button2Text?: string;
    action: string;
    event: CalendarEvent<ExtraEventData>;
  };

  // initially no actions available for an event because don't know if logged in
  private actions: CalendarEventAction[]=[];
  // available actions when logged in
  private actionsLoggedIn: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
        this.handleEvent('Edited', event, "Edit an Event", this.editEventContent, "Update", "Cancel");
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
        this.events$ = this.events$.filter(iEvent => iEvent !== event);
        this.activeDayIsOpen=false; // may have deleted all events for current day
        this.handleEvent('Deleted', event, "Delete an Event", this.editEventContent, "Delete", "Cancel");
      }
    }
  ];
    
  private events$: CalendarEvent[];

  constructor(private calEventService: CalEventService, private authService: AuthService, 
               private modalService: BsModalService, private http: HttpClient) {}

  private openModal(template: TemplateRef<any>) {
    //this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    /*this.fetchEvents();*/
    this.getCalendarEvents();
  }
  
  private onSubmit() {
    //console.log("submitted..."+this.curEvent.title+" "+this.curEvent.meta.description+" "+this.curEvent.start);
    if (!this.curEvent.start || !this.curEvent.title || !this.curEvent.color) {
        this.formError = "Start, title and color scheme required";
        return false;
    } else {
        this.formError = ""; // reset in case of prior error
        this.updateCalendarEvent(this.curEvent);
        this.modalRef.hide();
    }
  }
  
  private createCalendarEvent(cevent : CalEvent) : CalendarEvent<ExtraEventData> {
      let result: CalendarEvent<ExtraEventData>= {
        start: cevent.start,
        title: cevent.title,
        meta: {}
      };
      if (this.authService.isLoggedIn()) {
        result.actions=this.actionsLoggedIn;
      }     
      
      if (cevent.id)
        result.id=cevent.id;
      if (cevent.color)
        result.color=cevent.color;
      if (cevent.description)
        result.meta.description = cevent.description;
      if (cevent.end)
        result.end=cevent.end;
      if (cevent.allDay)
        result.allDay=cevent.allDay;
      if (cevent.resizable)
        result.resizable=cevent.resizable;
      if (cevent.draggable)
        result.draggable=cevent.draggable;
      return result;
  }
  
  private getCalendarEvents(): void {
    let self=this;
    this.calEventService.getCalendarEvents()
    .subscribe(calEvents => this.events$ = calEvents.map(x=>self.createCalendarEvent(x)));
  }
  
  private updateCalendarEvent(event: CalendarEvent<ExtraEventData>): void {
    let self=this;
    this.calEventService.updateCalendarEvent(this.transformToCalEvent(event))
    .subscribe({
                  next(x) { /*console.log('data: ', x);*/ 
                            // update calendar event with latest information
                            // self.formInfo= "Event has been updated updated successfully";
                            self.refresh.next();
                  },
                  error(err) { self.formError = err.message;
                                console.log('Some error '+err.message); 
                             }
              });
  }

  private transformToCalEvent(event: CalendarEvent<ExtraEventData>): CalEvent {
    let result: CalEvent= {
        start: event.start,
        title: event.title,
        id: event.id||0,
        color: event.color || this.colors.red
      };
      
     
      if (event.meta.description)
        result.description=event.meta.description;
      if (event.end)
        result.end=event.end;
      if (event.allDay)
        result.allDay=event.allDay;
      if (event.resizable)
        result.resizable=event.resizable;
      if (event.draggable)
        result.draggable=event.draggable;
      return result;

  } 
  
  private handleEvent(action: string, event: CalendarEvent<ExtraEventData>, header: string, 
               bodyTemplate: TemplateRef<any>, button1Text: string, button2Text?: string): void {
    this.curEvent=event; // make current event available to templates
    if (button2Text)
      this.modalData = { bodyTemplate, header, button1Text, button2Text, event, action };
    else
       this.modalData = { bodyTemplate, header, button1Text, event, action };
    this.openModal(this.modalContent);
  }
  
  /*
  private fetchEvents(): void {
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
  
  private dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ film: Film }>>;
  }): void {
    this.dateClicked=date;
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
  
  /*
  private eventClicked(event: CalendarEvent<{ film: Film }>): void {
    window.open(
      `https://www.themoviedb.org/movie/${event.meta.film.id}`,
      '_blank'
    );
  }
  */
  
}
