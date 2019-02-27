import { Money } from './Money';

export interface OrderLineItemTax {
  catalog_object_id? : string; // The catalog object id referencing CatalogTax.
  name : string; // the tax's name
  type : string; // indicates the calculation method used to apply the tax. See OrderLineItemTaxType - currently
                 // ADDITIVE or INCLUSIVE - for possible values.
  percentage : string; // The percentage of the tax, as a string representation of a decimal number. A value of 7.25 
                       // corresponds to a percentage of 7.25%.
  applied_money : Money; // The amount of the money applied by the tax in an order.
  scope : string; // Indicates the level at which the tax applies. This field is set by the server. If set in a CreateOrder request, 
                  // it will be ignored on write. See OrderLineItemTaxScope -- currently LINE_ITEM or ORDER -- for possible values.
  
}
