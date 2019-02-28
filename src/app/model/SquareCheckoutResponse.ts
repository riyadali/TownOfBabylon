import { Address } from './Address';
import { Order } from './Order';
import { AdditionalRecipient } from './AdditionalRecipient';

// Definition from https://docs.connect.squareup.com/api/connect/v2#type-
export interface SquareCheckoutResponse {
  id : string;
  checkout_page_url : string;
  ask_for_shipping_address? : boolean;
  merchant_support_email? : string;
  pre_populate_buyer_email? : string;
  pre_populate_shipping_address? : Address;
  redirect_url? : string;
  order : Order;
  created_at : string;
  additional_recipients : AdditionalRecipient [];
}
