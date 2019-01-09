import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { CalEvent } from '../model/CalEvent';
import { CalEventService } from '../cal-event.service';

import { AuthService } from '../auth/auth.service';

import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import { collapseAnimation } from 'angular-calendar'; /* refer to 
    https://github.com/mattlewis92/angular-calendar/issues/747 */

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ColorScheme } from '../model/ColorScheme';

import {
  compareAsc,
  isSameMonth,
  isSameDay,
  isSameHour,
  isSameMinute,
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


/* Matt Lewis uses this approach in his code here 
   https://mattlewis92.github.io/angular-calendar/#/additional-event-properties */
interface ExtraEventData {  
   description? : string;
}

import modalTemplate from "../modal-views/modal.template.html";
import editEventTemplate from "../modal-views/edit-event.template.html";
import deleteEventTemplate from "../modal-views/delete-event.template.html";
import cloneEventTemplate from "../modal-views/clone-event.template.html";
import clickEventTemplate from "../modal-views/click-event.template.html";
import mainTemplate from "./calendar-editable.component.html";

@Component({
  selector: 'app-calendar-editable',
 // templateUrl: './calendar-editable.component.html',
  template: modalTemplate+mainTemplate+editEventTemplate+deleteEventTemplate+cloneEventTemplate+clickEventTemplate,
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
  
  @ViewChild('deleteEventContent')
  private deleteEventContent: TemplateRef<any>;
  
  @ViewChild('cloneEventContent')
  private cloneEventContent: TemplateRef<any>;
  
  @ViewChild('clickEventContent')
  private clickEventContent: TemplateRef<any>;
  
  // Some default color schemes -- now setup on server side
  
 
  private sampleColorScheme: ColorScheme = {
    name: '',
    primary: '#ff7d04',
    secondary: '#ffcf9b'
  }
  
  /*
  redColorScheme : ColorScheme = {
      id: 1,
      name: 'Red',
      primary: '#ad2121',
      secondary: '#FAE3E3'
  };

  yellowColorScheme : ColorScheme = {
      id: 2,
      name: 'Yellow',
      primary: '#e3bc08',
      secondary: '#FDF1BA'
  };
 
  blueColorScheme : ColorScheme = {
      id: 3,
      name: 'Blue',
      primary: '#1e90ff',
      secondary: '#D1E8FF'
  };
  */

  private colorSchemes: ColorScheme[]; // color schemes to be displayed in view  
  private customColorScheme: ColorScheme; // used in view for custom color scheme values

  // Controls refresh of display after changes have been made to events
  private refresh: Subject<any> = new Subject();
  
  // Subscription to loginStatus subject
  private loginStatusSubscription: Subscription;
  
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
  //private evnts: Array<CalendarEvent<ExtraEventData>>;

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
      label: '<i class="fas fa-pencil-alt"></i>',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
        this.handleEvent('Edited', event, "Edit Event", this.editEventContent, "Update", "Cancel");
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
       // this.events$ = this.events$.filter(iEvent => iEvent !== event);
        this.activeDayIsOpen=false; // may have deleted all events for current day
        this.handleEvent('Deleted', event, "Delete Event", this.deleteEventContent, "Delete", "Cancel");
      }
    },
    {
      label: '<i class="fas fa-clone" aria-hidden="true">',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
        this.handleEvent('Cloned', event, "Clone Event", this.cloneEventContent, "Clone", "Cancel");
      }
    }
  ];
 
  private curAction: string;
    
  private events$: CalendarEvent[];

  constructor(private calEventService: CalEventService, private authService: AuthService, 
               private modalService: BsModalService, private http: HttpClient) {}

  private openModal(template: TemplateRef<any>) {
    //this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    /*this.fetchEvents();*/
    this.loadColorSchemes();
    this.getCalendarEvents();
    // Schedule a refresh of the display if the user logs in or logs out
    // Unfortunately can't control logout that happens outside the scope of
    // the app -- for example when the login token expires
    // Note, however, the authentication service when checking login status
    // will detect an expired token and would then simulate a logout which
    // would cause the loginStatus subject to fire an event.
    // So the  window when the app would have an expired token with the view
    // reflecting a "logged in" status could be very small since the check 
    // whether you are logged in is triggered frequently from the templates in the 
    // view with checks such as the following
    // <ul class="navbar-nav" [hidden]="authService.isLoggedIn()">
    let self=this;
    this.loginStatusSubscription = this.authService.loginStatus.subscribe(() => {
        self.colorSchemes=[];
        self.events$=[];
        self.loadColorSchemes();
        self.getCalendarEvents();        
    });
  }
  
  ngOnDestroy(): void {
    if (this.loginStatusSubscription) {
      this.loginStatusSubscription.unsubscribe();
    }
  }
  
  private onSubmit() {
    if (this.curAction=="Edited") {
      this.onSubmitForUpdate();
    } else if (this.curAction=="Deleted") {
      this.onSubmitForDelete();
    } else if (this.curAction=="Clicked") {
      this.onSubmitForClick();    
    } else if (this.curAction=="Cloned") {
      this.onSubmitForClone();
    } else {
      // should not get here
    }
  }
  
  private onSubmitForUpdate() {
    //console.log("submitted..."+this.curEvent.title+" "+this.curEvent.meta.description+" "+this.curEvent.start);
    if (this.formInputValid()) {
        this.formError = ""; // reset in case of prior error
        this.updateCalendarEvent(this.curEvent);
        this.modalRef.hide();
    }   
  }

  private onSubmitForClick() {
  }

  private onSubmitForClone() {
     //console.log("submitted..."+this.curEvent.title+" "+this.curEvent.meta.description+" "+this.curEvent.start);
    if (this.formInputValid()) {
        this.formError = ""; // reset in case of prior error
        this.updateCalendarEvent(this.curEvent);
        this.modalRef.hide();
    }   
  }

  private formInputValid() : boolean {
    
    if (!this.curEvent.start || !this.curEvent.title || this.curEvent.title.trim() == "" || !this.curEvent.color) {
        this.formError = "Start, title and color scheme required";
        return false;
    } else if (this.curEvent.end&&
                compareAsc(this.curEvent.start,this.curEvent.end)!==-1
                // the or condition is for the case where the end datetime is after the start because of the "seconds" portion
                // but in reality the two times are the same when least significant part of the time being
                // considered is minutes
                || (isSameDay(this.curEvent.start,this.curEvent.end)&&
                    isSameHour(this.curEvent.start,this.curEvent.end)&&
                    isSameMinute(this.curEvent.start,this.curEvent.end)) 
                ) {
        this.formError = "End date must be after start date";
        return false;
    } else if (this.curEvent.color.name&&this.customColorScheme.name&&this.customColorScheme.name.trim()!=="") {
        this.formError = "Choose an existing color scheme or specify a custom one, but not both";
    } else if (!this.curEvent.color.name&&(!this.customColorScheme.name||this.customColorScheme.name.trim()=="")) {
        this.formError = "A color scheme is required. Choose an existing color scheme or specify a custom one";
        return false;
    } else if (this.customColorScheme.name&&this.colorSchemes.some(x=>{
                  return x.name&&x.name.trim().toLowerCase()==this.customColorScheme.name.trim().toLowerCase();
                })
              ){
        this.formError = "Name of custom color scheme cannot match that of an existing color scheme";
        return false;
    } else {
      return true;
    }

  }
  
  private onSubmitForDelete() {
     this.deleteCalendarEvent(this.curEvent);
     this.modalRef.hide();     
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
  
  private loadColorSchemes(): void {    
    //this.colorSchemes=[this.sampleColorScheme, this.redColorScheme, this.blueColorScheme, this.yellowColorScheme]
    this.getColorSchemes();
  }

  private compareColorSchemes = (a: ColorScheme, b: ColorScheme) => this._compareColorSchemes(a, b);

  _compareColorSchemes(a: ColorScheme, b: ColorScheme) {
    // Handle compare logic (eg check if unique ids are the same)
    return a && b ? a.name === b.name : a === b;
  }
  
  private addColorScheme(colorScheme: ColorScheme) : void {
    let self=this;
    colorScheme.owner=this.authService.currentUser().user.id; // associate an owner with color scheme 
    this.calEventService.addColorScheme(colorScheme)
      // make color scheme available as a selectable option on the view by pushing it to the colorSchemes array
      .subscribe(colorScheme => self.colorSchemes.push(colorScheme));
  }
  
  private getColorSchemes(): void {
    let self=this;
    let myId=this.authService.isLoggedIn() ? this.authService.currentUser().user.id : null;
    this.calEventService.getColorSchemes()
    .subscribe(colorSchemes => {
                                  self.colorSchemes = colorSchemes.filter(x=>{                                    
                                      return typeof x.owner === 'undefined' || (x.owner == myId);
                                  });
                                  self.colorSchemes.unshift(self.sampleColorScheme);
                                });
  }
  
  private getCalendarEvents(): void {
    let self=this;
    this.calEventService.getCalendarEvents()
    .subscribe(calEvents => self.events$ = calEvents.map(x=>self.createCalendarEvent(x)));
  }
  
  private updateCalendarEvent(event: CalendarEvent<ExtraEventData>): void {
    event.title=event.title.trim();
    if (event.meta.description) {
       event.meta.description=event.meta.description.trim();
    }
    
   if (this.customColorScheme.name) {
      this.customColorScheme.name=this.customColorScheme.name.trim();
      event.color=this.customColorScheme;      
      // Add the custom color scheme to the server
      // Also make it available as a selectable option on the view by pushing it to the colorSchemes array
      this.addColorScheme(this.customColorScheme); 
    }
    let self=this;
    this.calEventService.updateCalendarEvent(this.transformToCalEvent(event))
    .subscribe({
                  next() { /*console.log('data: ', x);*/                             
                            // self.formInfo= "Event has been updated updated successfully";
                    
                            // update the events array so that it reflects the latest info 
                            // since the views are dependent on this array                            
                            let tgtIndex=self.events$.findIndex(x=>x.id==event.id);                            
                            if (tgtIndex!==-1) {
                              let tgtActions=self.events$[tgtIndex].actions;
                              self.events$[tgtIndex]=event;
                              self.events$[tgtIndex].actions=tgtActions; //restore actions
                            }
                            self.refresh.next();
                  },
                  error(err) { self.formError = err.message;
                                console.log('Some error '+err.message); 
                             }
              });
  }
  
  private deleteCalendarEvent(event: CalendarEvent<ExtraEventData>): void {
    let self=this;
    this.calEventService.deleteCalendarEvent(this.transformToCalEvent(event))
    .subscribe({
                  next() { /*console.log('data: ', x);*/                             
                            
                            // update the events array so that it reflects the latest info 
                            // since the views are dependent on this array
                            self.events$ = self.events$.filter(e => e.id !== event.id);                           
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
        color: event.color || this.sampleColorScheme
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
    this.curAction=action; // save action so that you know what to do on submit
    
    // The events array always represent the truth (i.e. it is a reflection of the server)
    // Thus if the view (i.e. curEvents) is changed in the modal, this does not corrupt the truth (i.e.,
    // the events array    
    // Note: deep copy gotten from https://stackoverflow.com/questions/47413003/how-can-i-deep-copy-in-typescript  
    this.curEvent=JSON.parse(JSON.stringify(event)); // make deep copy of current event available to templates
    this.curEvent.start=new Date(this.curEvent.start); // recast as date field
    if (this.curEvent.end)
      this.curEvent.end=new Date(this.curEvent.end); // recast as date field
    
    // make fresh copy of sample color available to templates
    this.customColorScheme = {...this.sampleColorScheme};
    
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
  
  /*
  // This sample copied from https://stackoverflow.com/questions/44808882/create-a-clone-of-an-array-in-typescript
  private deepCloneArray (inArr:Array<any>[]):  Array<any> {     
    const myClonedArray = [];   
    // refer to link https://googlechrome.github.io/samples/object-assign-es6/ for shallow copy (also {...obj} works as well)
    // deep copy gotten from https://stackoverflow.com/questions/47413003/how-can-i-deep-copy-in-typescript  
    inArr.map(val => myClonedArray.push(JSON.parse(JSON.stringify(val))));
    return myClonedArray;
  }
  */
  
}
