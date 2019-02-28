import { Address } from './Address';
import { Order } from './Order';
import { AdditionalRecipient } from './AdditionalRecipient';

// Definition from https://docs.connect.squareup.com/api/connect/v2#type-checkout
export interface SquareCheckout {
  id? : string;
  checkout_page_url? : string; // The URL that the buyer's browser should be redirected to after the checkout is completed.
  ask_for_shipping_address? : boolean; // If true, Square Checkout will collect shipping information on your behalf and 
                                       // store that information with the transaction information in your Square Dashboard.
  merchant_support_email? : string; // The email address to display on the Square Checkout confirmation page and confirmation 
                                    // email that the buyer can use to contact the merchant.
                                    // If this value is not set, the confirmation page and email will display the primary email 
                                    // address associated with the merchant's Square account.
  pre_populate_buyer_email? : string;
  pre_populate_shipping_address? : Address;
  redirect_url? : string; // The URL to redirect to after checkout is completed with checkoutId, Square's orderId, transactionId, 
                          // and referenceId appended as URL parameters. For example, if the provided redirect_url is 
                          // http://www.example.com/order-complete, a successful transaction redirects the customer to:
                          // http://www.example.com/order-complete?checkoutId=xxxxxx&orderId=xxxxxx&referenceId=xxxxxx&transactionId=xxxxxx
                          //
                          // If you do not provide a redirect URL, Square Checkout will display an order confirmation page on your 
                          // behalf; however Square strongly recommends that you provide a redirect URL so you can verify the transaction 
                          // results and finalize the order through your existing/normal confirmation workflow.
  order : Order;
  created_at : string;  // The time when the checkout was created, in RFC 3339 format.
  additional_recipients : AdditionalRecipient []; // Additional recipients (other than the merchant) receiving a portion of this checkout. 
                                                  // For example, fees assessed on the purchase by a third party integration.
}
