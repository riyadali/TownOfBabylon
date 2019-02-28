import { Money } from './Money';
import { OrderLineItem } from './OrderLineItem';
import { OrderLineItemTax } from './OrderLineItemTax';
import { OrderLineItemDiscount } from './OrderLineItemDiscount';

export interface Order {
  id? : string; // The order's unique ID. This value is only present for Order objects created by 
               // the Orders API through the CreateOrder endpoint.
  location_id? : string; // The ID of the merchant location this order is associated with.
  reference_id? : string; // A client specified identifier to associate an entity in another system with this order.
  line_items : OrderLineItem [];
  taxes? : OrderLineItemTax []; // A list of taxes applied to this order. On read or retrieve, this list includes
                               // both order-level and item-level taxes. When creating an Order, set your order-level taxes
                               // in this list.
  discounts? : OrderLineItemDiscount []; // A list of discounts applied to this order. On read or retrieve, this list includes
                               // both order-level and item-level discounts. When creating an Order, set your order-level discounts
                               // in this list.
  fulfillments? : any []; // this is a beta field. The actual type is OrderFulfillment[]. Details on order fulfillment.
                         // Orders can only be created with at most one fulfillment. However, orders returned by the 
                         // API may contain multiple fulfillments.
  total_money : Money;
  total_tax_money? : Money;
  total_discount_money? : Money; 
}
