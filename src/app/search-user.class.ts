export class SearchUser {
  constructor(public id: number, public name: string) {}
}

export interface IUserResponse {
 /* total: number;  */
  results: SearchUser[];
}
