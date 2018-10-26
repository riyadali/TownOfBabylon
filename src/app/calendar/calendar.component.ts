import { Component, OnInit, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarEventAction, DAYS_OF_WEEK, CalendarView } from 'angular-calendar';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { collapseAnimation } from 'angular-calendar'; /* refer to https://github.com/mattlewis92/angular-calendar/issues/747 */
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns'; 

import "regenerator-runtime/runtime.js";
import * as icsParser from '../../javascript/ics-to-json';

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

/* My custom calendar event - extended from Matt Lewis CalendarEvent found at
   https://github.com/mattlewis92/calendar-utils/blob/master/src/calendar-utils.ts
   */
//interface CustomCalendarEvent extends CalendarEvent {
    /* curDay is only set for the first event in the event list
       for a clicked date. It is just a hack to pass the date clicked
       to the daysEvents template since this information apparently is not
       available to the <mwl-calendar-open-day-events> component.  It is, 
       however, available in the parent compenent, <mwl-calendar-month-view>, as
       viewDate, but since I done control this code I cannot pass it as
       an input to the child template.  So my hack is to pass it in the Events list>. */
//    curDay: Date;      
//};

/* This interface replaces the CustomCalendarEvent interface above */
/* Matt Lewis uses this approach in his code here 
   https://mattlewis92.github.io/angular-calendar/#/additional-event-properties */
interface ExtraEventData {   
   curDay : Date
}


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  animations: [collapseAnimation],
  styleUrls: ['./calendar.component.scss']
})
export class MyCalendarComponent implements OnInit {
  
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;
  
  @ViewChild('dayEventsTemplate')
  dayEventsTemplate: TemplateRef<any>;
  
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  
  activeDayIsOpen: boolean = true;
  
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
 

   modalData: {
    action: string;
    event: CalendarEvent<ExtraEventData>;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent<ExtraEventData> }): void => {
        this.evnts = this.evnts.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  /* extraEventData: ExtraEventData; */
  
  // evnts: CustomCalendarEvent[] = [ 
  evnts: Array<CalendarEvent<ExtraEventData>> = [    
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),      
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      meta: {
        /* Initially set curDay to "Today" -- the default date. */
        curDay: new Date()
      }
    },
    {
      start: startOfDay(new Date()),     
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
      meta: {  
        /* Initially set curDay to "Today" -- the default date. */
        curDay: new Date()
      }
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),      
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
      meta: {   
        /* Initially set curDay to "Today" -- the default date. */
        curDay: new Date()
      }
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),     
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true,
      meta: { 
        /* Initially set curDay to "Today" -- the default date. */
        curDay: new Date()
      }
    }
  ];
  //] as CalendarEvent[];
  
  handleEvent(action: string, event: CalendarEvent<ExtraEventData>): void {
    this.modalData = { event, action };
    this.openModal(this.modalContent);
  }

  dayClicked({ date, events }: { date: Date; events: Array<CalendarEvent<ExtraEventData>>}): void {
    if (isSameMonth(date, this.vwDate)) {
      this.vwDate = date;
      if (
        (isSameDay(this.vwDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        //events[0].curDay=date; /* hack to pass the date clicked to my custom dayEventsTemplate */
        events[0].meta.curDay=date; /* hack to pass the date clicked to my custom dayEventsTemplate */
        this.activeDayIsOpen = true;
      }
    }
  }


  exclDays: number[] = [0, 6];

  wkStartsOn = DAYS_OF_WEEK.TUESDAY;
    
  ngOnInit() {
  //  if (this.evnts[0]) {
  //     this.evnts[0].curDay=new Date(); /* set default current day for dayEventsTemplate */
  //  }
    var iCalendarData = `BEGIN:VCALENDAR
PRODID:-//lanyrd.com//Lanyrd//EN
X-ORIGINAL-URL:http://lanyrd.com/topics/nodejs/nodejs.ics
X-WR-CALNAME;CHARSET=utf-8:Node.js conferences
VERSION:2.0
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:Dyncon 2011
LOCATION;CHARSET=utf-8:Stockholm, Sweden
URL:http://lanyrd.com/2011/dyncon/
UID:d4c826dfb701f611416d69b4df81caf9ff80b03a
DTSTART:20110312T200000Z
DTEND;VALUE=DATE:20110314
END:VEVENT
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:[Async]: Everything Express
LOCATION;CHARSET=utf-8:Brighton, United Kingdom
URL:http://lanyrd.com/2011/asyncjs-express/
UID:480a3ad48af5ed8965241f14920f90524f533c18
DTSTART;VALUE=DATE:20110324
DTEND;VALUE=DATE:20110325
END:VEVENT
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:JSConf US 2011
LOCATION;CHARSET=utf-8:Portland, United States
URL:http://lanyrd.com/2011/jsconf/
UID:ed334cc85db5ebdff5ff5a630a7a48631a677dbe
DTSTART;VALUE=DATE:20110502
DTEND;VALUE=DATE:20110504
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
END:VEVENT
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:NodeConf 2011
LOCATION;CHARSET=utf-8:Portland, United States
URL:http://lanyrd.com/2011/nodeconf/
UID:25169a7b1ba5c248278f47120a40878055dc8c15
DTSTART;VALUE=DATE:20110505
DTEND;VALUE=DATE:20110506
ORGANIZER:MAILTO:john.doe@example.com
END:VEVENT
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:BrazilJS
LOCATION;CHARSET=utf-8:Fortaleza, Brazil
URL:http://lanyrd.com/2011/braziljs/
UID:dafee3be83624f3388c5635662229ff11766bb9c
DTSTART;VALUE=DATE:20110513
DTEND;VALUE=DATE:20110515
END:VEVENT
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:Falsy Values
LOCATION;CHARSET=utf-8:Warsaw, Poland
URL:http://lanyrd.com/2011/falsy-values/
UID:73cad6a09ac4e7310979c6130f871d17d990b5ad
DTSTART;VALUE=DATE:20110518
DTEND;VALUE=DATE:20110521
END:VEVENT
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:nodecamp.eu
LOCATION;CHARSET=utf-8:Cologne, Germany
URL:http://lanyrd.com/2011/nodecampde/
UID:b728a5fdb5f292b6293e4a2fd97a1ccfc69e9d6f
DTSTART;VALUE=DATE:20110611
DTEND;VALUE=DATE:20110613
END:VEVENT
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:Rich Web Experience 2011
LOCATION;CHARSET=utf-8:Fort Lauderdale, United States
URL:http://lanyrd.com/2011/rich-web-experience/
UID:47f6ea3f28af2986a2192fa39a91fa7d60d26b76
DTSTART;VALUE=DATE:20111129
DTEND;VALUE=DATE:20111203
END:VEVENT
BEGIN:VEVENT
SUMMARY;CHARSET=utf-8:Foobar
UID:sdfkf09fsd0
DTSTART;VALUE=DATE:Next Year
DTEND;VALUE=DATE:20111203
END:VEVENT

END:VCALENDAR`;
    var data = icsParser.icsToJson(iCalendarData);
  console.log(data.startDate)

  }

}

