/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module "ics-to-json"{ 
   /* export function icsToJson(p: string): any; */
   export default function (string) : Array<IIcsCalendarEvent>;
}

interface IIcsCalendarEvent {
  startDate: string;
  endDate: string;
  description: string;
  summary: string;
  location: string;
}

// Needed to import template files as string.
// An example of where this is used is for the modal content templates

declare module "*.html" {
  const content: string;
  export default content;
}
