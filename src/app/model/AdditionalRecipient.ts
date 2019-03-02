import { Money } from './Money';

// Definition from https://docs.connect.squareup.com/api/connect/v2#type-
export interface AdditionalRecipient {
  location_id : string;
  description : string;
  amount_money : Money;
  receivable_id : string;  
}
