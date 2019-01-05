export interface ColorScheme {  
  id?: number;
  // color schemes with no owners are the default color schemes
  owner?: number;
  name: string;
  /* may eventually want to explictly type these as "Color" --
     refer to this link for a start https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/color/color-tests.ts
  */
  primary: string;
  secondary: string;
}
