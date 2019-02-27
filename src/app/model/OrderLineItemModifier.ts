import { Money } from './Money';

export interface OrderLineItemModifier { // is classified as a CatalogModifier
  catalog_object_id? : string; // The catalog object id referencing CatalogModifier.
  name : string; // The name of the item modifier.  
  base_price_money? : Money; // The base price for the modifier. base_price_money is required for ad hoc modifiers. If both 
                             // catalog_object_id and base_price_money are set, base_price_money will override the predefined 
                             // CatalogModifier price.
  total_price_money : Money; // The total price of the item modifier for its line item. This is the modifier's base_price_money 
                             // multiplied by the line item's quantity. 
}
