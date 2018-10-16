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
        events[0].extraEventData.curDay=date; /* hack to pass the date clicked to my custom dayEventsTemplate */
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
  }

}

