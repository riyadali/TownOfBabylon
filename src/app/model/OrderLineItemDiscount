import { Money } from './Money';

export interface OrderLineItemDiscount {
  catalog_object_id? : string; // The catalog object id referencing CatalogDiscount.
  name : string; // the discount's name
  type : string; // The type of the discount. If it is created by API, it would be either FIXED_PERCENTAGE or FIXED_AMOUNT.
                 // VARIABLE_* is not supported in API because the order is created at the time of sale and either percentage 
                 // or amount has to be specified.
                 // See OrderLineItemDiscountType -- currently FIXED_PERCENTAGE, FIXED_AMOUNT, VARIABLE_PERCENTAGE or 
                 /  VARIABLE_AMOUNT -- for possible values.
  percentage? : string; // The percentage of the discount, as a string representation of a decimal number. A value of 7.25 
                       // corresponds to a percentage of 7.25%. The percentage won't be set for an amount-based discount.
  amount_money? : Money; // The total monetary amount of the applicable discount. If it is at order level, it is the value 
                        // of the order level discount. If it is at line item level, it is the value of the line item level 
                        // discount. The amount_money won't be set for a percentage-based discount.
  applied_money? : Money; // The amount of discount actually applied to this line item. Represents the amount of money applied
                          // to a line item as a discount When an amount-based discount is at order-level, this value is different 
                          // from amount_money because the discount is distributed across the line items.
                        // of the order level discount. If it is at line item level, it is the value of the line item level 
                        // discount. The amount_money won't be set for a percentage-based discount.
  scope : string; // Indicates the level at which the discount applies. This field is set by the server. If set in a CreateOrder request, 
                  // it will be ignored on write. See OrderLineItemDiscountScope -- currently LINE_ITEM or ORDER -- for possible values.
  
}
