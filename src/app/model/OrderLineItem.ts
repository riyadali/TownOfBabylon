import { Money } from './Money';
import { OrderLineItemModifier } from './OrderLineItemModifier';
import { OrderLineItemTax } from './OrderLineItemTax';
import { OrderLineItemDiscount } from './OrderLineItemDiscount';


// Definition from https://docs.connect.squareup.com/api/connect/v2#type-orderlineitem
export interface OrderLineItem {
  name : string;
  quantity : string; // The quantity purchased, as a string representation of a number. This string must have a positive integer value
  note? : string; // The note of the line item.
  catalog_object_id? : string; // The CatalogItemVariation id applied to this line item.
  variation_name? : string; // The name of the variation applied to this line item.
  modifiers? : OrderLineItemModifier []; // The CatalogModifiers applied to this line item.
  taxes? : OrderLineItemTax []; // A list of taxes applied to this line item. On read or retrieve, this list includes 
                                // both item-level taxes and any order-level taxes apportioned to this item. When creating an Order, 
                                // set your item-level taxes in this list.
  discounts? : OrderLineItemDiscount []; // A list of discounts applied to this line item. On read or retrieve, this list includes 
                                // both item-level discounts and any order-level discounts apportioned to this item. When creating an Order, 
                                // set your item-level discounts in this list.
  base_price_money : Money; // The base price for a single unit of the line item.
  gross_sales_money? : Money; // The gross sales amount of money calculated as (item base price + modifiers price) * quantity.
  total_tax_money? : Money; // The total tax amount of money to collect for the line item.
  total_discount_money? : Money; // The total discount amount of money to collect for the line item.
  total_money? : Money; // The total amount of money to collect for this line item.
}
