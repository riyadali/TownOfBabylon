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
import * as icsParser from 'ics-to-json';

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
VERSION:2.0
PRODID:iCalendar-Ruby
BEGIN:VEVENT
UID:6f167814-916e-4cfa-9b50-29b2a1b1aee4@ny-babylon.civicplus.com
URL:/common/modules/iCalendar/iCalendar.aspx?feed=calendar&catID=14
CREATED:20181026T173007Z
LAST-MODIFIED:20180109T182025Z
SUMMARY:Town Board Meeting
DTSTART:20181219T203000Z
DTEND:20181220T045900Z
LOCATION:Town Hall - 200 East Sunrise Highway  Lindenhurst NY 11757
DESCRIPTION:There will be a regularly scheduled meeting of the Babylon Town Board on this date to be held at Babylon Town Hall. \n http://www.townofbabylon.com/calendar.aspx?EID=1147
END:VEVENT
BEGIN:VEVENT
UID:d6e30eef-7b05-4d1a-be75-41ea3a8d492b@ny-babylon.civicplus.com
URL:/common/modules/iCalendar/iCalendar.aspx?feed=calendar&catID=14
CREATED:20181026T173007Z
LAST-MODIFIED:20180109T181954Z
SUMMARY:Town Board Meeting
DTSTART:20181205T203000Z
DTEND:20181206T045900Z
LOCATION:Town Hall - 200 East Sunrise Highway  Lindenhurst NY 11757
DESCRIPTION:There will be a regularly scheduled meeting of the Babylon Town Board on this date to be held at Babylon Town Hall. \n http://www.townofbabylon.com/calendar.aspx?EID=1146
END:VEVENT
BEGIN:VEVENT
UID:40987287-aac1-4961-89fa-cc694688aca6@ny-babylon.civicplus.com
URL:/common/modules/iCalendar/iCalendar.aspx?feed=calendar&catID=14
CREATED:20181026T173007Z
LAST-MODIFIED:20180109T181913Z
SUMMARY:Town Board Meeting
DTSTART:20181115T203000Z
DTEND:20181116T045900Z
LOCATION:Town Hall - 200 East Sunrise Highway  Lindenhurst NY 11757
DESCRIPTION:There will be a regularly scheduled meeting of the Babylon Town Board on this date to be held at Babylon Town Hall. \n http://www.townofbabylon.com/calendar.aspx?EID=1145
END:VEVENT
BEGIN:VEVENT
UID:bb3abeaf-8ce9-47f7-9ae3-cb20fca7ec7c@ny-babylon.civicplus.com
URL:/common/modules/iCalendar/iCalendar.aspx?feed=calendar&catID=14
CREATED:20181026T173007Z
LAST-MODIFIED:20181003T204311Z
SUMMARY:Hope for the Warriors Run
DTSTART:20181110T110000Z
DTEND:20181111T045900Z
LOCATION:Town Hall - 200 East Sunrise Highway  Lindenhurst NY 11757
DESCRIPTION:Come participate in the annual Run for the Warriors! Participants can run in either a 10K, 5K or one-mile course. See the flyer for more details, and register here: http://www.athlinks.com/event/11th-annual-run-for-the-warriors-long-island-9510 http://www.townofbabylon.com/calendar.aspx?EID=1201
END:VEVENT
BEGIN:VEVENT
UID:9fddeca9-5584-4209-bcab-b8d612f336e7@ny-babylon.civicplus.com
URL:/common/modules/iCalendar/iCalendar.aspx?feed=calendar&catID=14
CREATED:20181026T173007Z
LAST-MODIFIED:20180109T181832Z
SUMMARY:Town Board Meeting
DTSTART:20181108T203000Z
DTEND:20181109T045900Z
LOCATION:Town Hall - 200 East Sunrise Highway  Lindenhurst NY 11757
DESCRIPTION:There will be a regularly scheduled meeting of the Babylon Town Board on this date to be held at Babylon Town Hall. \n http://www.townofbabylon.com/calendar.aspx?EID=1144
END:VEVENT
BEGIN:VEVENT
UID:9e097c9d-d71c-4905-a896-74d85458944b@ny-babylon.civicplus.com
URL:/common/modules/iCalendar/iCalendar.aspx?feed=calendar&catID=14
CREATED:20181026T173007Z
LAST-MODIFIED:20180820T132848Z
SUMMARY:Babylon Autumn Surf Fishing Tournament 2018
DTSTART:20181026T210000Z
DTEND:20181028T160000Z
LOCATION: -   Babylon NY 11702
DESCRIPTION:Supervisor Rich Schaffer and the rest of the Town Board invite you to compete in the 2018 Autumn Surf Fishing Tournament! See below for the registration application. http://www.townofbabylon.com/calendar.aspx?EID=1193
END:VEVENT
END:VCALENDAR`;
    var parsedData = icsParser.default(iCalendarData).then(function(xs) {
   
     xs.forEach((x)=>{
       console.log(x.startDate+"--"+x.summary+"--"+x.description);
     });
        
});

  }

}

