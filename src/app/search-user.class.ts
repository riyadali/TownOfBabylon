export class SearchDoc {
  constructor(public label: string, public value: string) {}
}

export interface IUserResponse {
  total: number;
  results: SearchDoc[];
}
