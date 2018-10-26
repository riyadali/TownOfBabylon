/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module "ics-to-json"{ 
    export function icsToJson(p: string): any; 
}
