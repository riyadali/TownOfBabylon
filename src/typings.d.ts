/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module "ics-to-json"{ 
   /* export function icsToJson(p: string): any; */
   export default function (string) : IcsParserPromise;
}

type IcsParserPromise = (x: string) => Promise<IIcsCalendarEvent[]>;

interface IIcsCalendarEvent {
  startDate: string;
  endDate: string;
  description: string;
  summary: string;
  location: string;
}
