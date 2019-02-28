// Definition from https://docs.connect.squareup.com/api/connect/v2#type-
export interface Address {
  address_line_1 : string;
  address_line_2? : string;
  address_line_3? : string;
  locality : string;  // city or town
  sublocality? : string;
  sublocality_2? : string;
  sublocality_3? : string;
  administrative_district_level_1 : string; // in US this is the state
  administrative_district_level_2? : string; // in US this is the county
  administrative_district_level_3? : string;
  postal_code : string;
  country : string; // The address's country, in ISO 3166-1-alpha-2 format.
  first_name? : string; // Optional first name when it's representing recipient.
  last_name? : string; // Optional last name when it's representing recipient.
  organization? : string; // Optional organization name when it's representing recipient.  
}
