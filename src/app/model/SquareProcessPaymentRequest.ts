// Loosely based on definition from https://docs.connect.squareup.com/api/connect/v2#endpoint-transactions-charge
// Note this is a partial definition and the nonce field is really card_nonce
export interface SquareProcessPaymentRequest {
  nonce: string;  
}
