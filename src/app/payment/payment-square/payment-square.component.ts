import { AfterViewInit, Component, OnInit, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { SquareProcessPaymentRequest } from '../../model/SquareProcessPaymentRequest';
import { Order } from '../../model/Order';
import { SquareCheckout } from '../../model/SquareCheckout';

import { SquarePaymentService } from '../../payment-square.service';

declare var SqPaymentForm : any; //magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'app-payment-square',
  templateUrl: './payment-square.component.html',
  styleUrls: ['./payment-square.component.scss']
})
export class PaymentSquareComponent implements OnInit, AfterViewInit {

  constructor(private squarePaymentService: SquarePaymentService, @Inject('Window') private window: Window
              , @Inject(DOCUMENT) private document: any
    ) { }

  paymentForm; //this is our payment form object
  private testButtonClicked: boolean;
  
  private skuCheckbox = false;
  private categoryCheckbox = true;
  private locationsCheckbox = true;
  private inStockCheckbox = true;
  private priceCheckbox = true;
  
  private shoppingItems = [
    {
      name: "Coffee",
      sku: "111111",
      category: "Hot Beverage",
      locations: "All locations",
      inStock: "3",
      price: "$2.00"
    },
    {
      name: "Tea",
      sku: "222222",
      category: "Hot Beverage",
      locations: "All locations",
      inStock: "8",
      price: "$1.00"
    },
    {
      name: "Cocoa",
      sku: "333333",
      category: "Hot Beverage",
      locations: "All locations",
      inStock: "20",
      price: "$1.50"
    }
  ];

  ngOnInit() {
    let self=this;
    // Set the application ID
    var applicationId = "sandbox-sq0idp-C6tuS5thsbqmjqa9LGiUyA";

    // Set the location ID
    var locationId = "CBASEFbzlRgZ_4BMSnfPml8y7rQgAQ";
    this.paymentForm = new SqPaymentForm({

      // Initialize the payment form elements
      applicationId: applicationId,
      locationId: locationId,
      inputClass: 'sq-input',
      // mediaMaxWidth: '520px', // keep in sync with mediawidth in external styles
    
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [{
          // from --
          // https://github.com/square/connect-api-examples/blob/master/templates/web-ui/payment-form/custom/sq-payment-form.js
        
          // backgroundColor: 'transparent',
          color: '#333333',
          fontFamily: '"Helvetica Neue", "Helvetica", sans-serif',
          fontSize: '16px',
          fontWeight: '400',
          placeholderColor: '#8594A7',
          placeholderFontWeight: '400',
          padding: '16px',
          _webkitFontSmoothing: 'antialiased',
          _mozOsxFontSmoothing: 'grayscale'
      }],
      
       // Initialize Google Pay button ID -- from 
       // https://github.com/square/connect-api-examples/blob/master/templates/web-ui/payment-form/custom/sq-payment-form.js
      googlePay: {
        elementId: 'sq-google-pay'
      },

      // Initialize Apple Pay placeholder ID -- from
      // https://github.com/square/connect-api-examples/blob/master/templates/web-ui/payment-form/custom/sq-payment-form.js
      applePay: {
        elementId: 'sq-apple-pay'
      },

      // Initialize Masterpass placeholder ID -- from
      // https://github.com/square/connect-api-examples/blob/master/templates/web-ui/payment-form/custom/sq-payment-form.js
      masterpass: {
        elementId: 'sq-masterpass'
      },
    
    
    
      // Initialize the credit card placeholders
      cardNumber: {
        elementId: 'sq-card-number',
        placeholder: '•••• •••• •••• ••••'
      },
      cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
      },
      expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
      },
      postalCode: {
        elementId: 'sq-postal-code'
      },
    
      // SqPaymentForm callback functions
      callbacks: {
    
        /*
         * callback function: methodsSupported
         * Triggered when: the page is loaded.
         */
        methodsSupported: function (methods) {
    
           // from https://github.com/square/connect-api-examples/blob/master/templates/web-ui/payment-form/custom/sq-payment-form.js
          
           if (!methods.masterpass && !methods.applePay && !methods.googlePay) {
              var walletBox = document.getElementById('sq-walletbox');
              walletBox.style.display = 'none';
           } else {
              var walletBox = document.getElementById('sq-walletbox');
              walletBox.style.display = 'block';
           }

          // Only show the button if Google Pay is enabled
          if (methods.googlePay === true) {
            var googlePayBtn = document.getElementById('sq-google-pay');
            googlePayBtn.style.display = 'inline-block';
          }

          // Only show the button if Apple Pay for Web is enabled
          if (methods.applePay === true) {
            var applePayBtn = document.getElementById('sq-apple-pay');
            applePayBtn.style.display = 'inline-block';
          }

          // Only show the button if Masterpass is enabled
          if (methods.masterpass === true) {
            var masterpassBtn = document.getElementById('sq-masterpass');
            masterpassBtn.style.display = 'inline-block';
          }
        },
    
        /*
         * callback function: createPaymentRequest
         * Triggered when: a digital wallet payment button is clicked.
         */
        createPaymentRequest: function () {
          var paymentRequestJson = {
            requestShippingAddress: false,
            requestBillingInfo: true,
            shippingContact: {
              familyName: "CUSTOMER LAST NAME",
              givenName: "CUSTOMER FIRST NAME",
              email: "mycustomer@example.com",
              country: "USA",
              region: "CA",
              city: "San Francisco",
              addressLines: [
                "1455 Market St #600"
              ],
              postalCode: "94103",
              phone:"14255551212"
           },
           currencyCode: "USD",
           countryCode: "US",
           total: {
              label: "MERCHANT NAME",
              amount: "1.00",
              pending: false
           },
           lineItems: [
              {
                label: "Subtotal",
                amount: "1.00",
                pending: false
              }
           ]
          };

          return paymentRequestJson;
        },
    
        /*
         * callback function: cardNonceResponseReceived
         * Triggered when: SqPaymentForm completes a card nonce request
         */
        cardNonceResponseReceived: function (errors, nonce, cardData)  {
          if (errors) {
            // Log errors from nonce generation to the Javascript console
            console.log("Encountered errors:");
            errors.forEach(function(error) {
              console.log('  ' + error.message);
            });
    
            return;
          }
    
          // alert('Nonce received: ' + nonce); /* FOR TESTING ONLY */
    
          // Assign the nonce value to the hidden form field
          // document.getElementById('card-nonce').value = nonce;
          //needs to be extracted from the
          (<HTMLInputElement>document.getElementById('card-nonce')).value = nonce; //casting so .value will work
          //get this value from the database when the user is logged in
          (<HTMLInputElement>document.getElementById('sq-id')).value = "CBASEC8F-Phq5_pV7UNi64_kX_4gAQ";
    
          // POST the nonce form to the payment processing page
          // (<HTMLFormElement>document.getElementById('nonce-form')).submit();
          // self.processCardPayment(); 
          self.processCheckout();
    
        },
    
        /*
         * callback function: unsupportedBrowserDetected
         * Triggered when: the page loads and an unsupported browser is detected
         */
        unsupportedBrowserDetected: function() {
          /* PROVIDE FEEDBACK TO SITE VISITORS */
        },
    
        /*
         * callback function: inputEventReceived
         * Triggered when: visitors interact with SqPaymentForm iframe elements.
         */
        inputEventReceived: function(inputEvent) {
          switch (inputEvent.eventType) {
            case 'focusClassAdded':
              /* HANDLE AS DESIRED */
              break;
            case 'focusClassRemoved':
              /* HANDLE AS DESIRED */
              break;
            case 'errorClassAdded':
              /* HANDLE AS DESIRED */
              break;
            case 'errorClassRemoved':
              /* HANDLE AS DESIRED */
              break;
            case 'cardBrandChanged':
              /* HANDLE AS DESIRED */
              break;
            case 'postalCodeChanged':
              /* HANDLE AS DESIRED */
              break;
          }
        },
    
        /*
         * callback function: paymentFormLoaded
         * Triggered when: SqPaymentForm is fully loaded
         */
        paymentFormLoaded: function() {
          /* HANDLE AS DESIRED */
        }
      }
    });
     
  }
  requestCardNonce(event) {

    // Don't submit the form until SqPaymentForm returns with a nonce
    event.preventDefault();
  
    // Request a nonce from the SqPaymentForm object
    this.paymentForm.requestCardNonce();
  }

  ngAfterViewInit() {
    if (SqPaymentForm.isSupportedBrowser()) {
      this.paymentForm.build();
      this.paymentForm.recalculateSize();
    }
  }
  
   // handle click of testButtonClicked
  private testButtonClickHandler() {
    if(this.testButtonClicked) {
      this.testButtonClicked = false;
    } else {
      this.testButtonClicked = true;
    }
  }
    
  // Get list of Catalog items
  private listCatalog(types) {  
    let self=this;   
    this.squarePaymentService.listCatalog(types)      
      .subscribe({
            next(response) { /*console.log('data: ', response);*/  
               self.squarePaymentService.listLocations()
                .subscribe({
                    next(resp) { /*console.log('data: ', resp);*/
                      let locations=resp.locations;
                      self.shoppingItems=response.objects.filter(elem=>elem.type==="ITEM" && !elem.is_deleted
                          && elem.item_data).flatMap(
                            // Note flatMap takes a function that maps an element to an array
                            // it then flattens that resulting array back to individual elements. 
                            // The final result is all of these indivdual elements merged together in a single array
                            // It is a usefuil way to "map" a single value to multiple values.
                            // Alternatives are reduce and concat, so arr1.flatMap(x => [x * 2]); is equivalent to 
                            // arr1.reduce((acc, x) => acc.concat([x * 2]), []);
                        
                            self.addVariations                         
                          ).map(elem=>{  
                               return { name: elem.name,
                                sku: elem.sku,
                                price: self.determineElemPrice(elem),
                                category: self.determineCategory(elem,response.objects.filter(elem=>elem.type==="CATEGORY")),
                                locations: self.determineLocations(elem,locations),
                                inStock: elem.in_stock,
                                is_variation_row: elem.is_variation_row
                              };
                            }); 
                    },
                    error(err) { //self.formError = err.message;
                      console.log('Some error '+err.message); 
                    }
                }); 
            },
            error(err) { //self.formError = err.message;
                        console.log('Some error '+err.message); 
            }
      });
  }
  
  // Add variations as individual rows as well as a header row for generic version of item
  private addVariations(elem): Array<any> {
    if (elem.item_data.variations==null||elem.item_data.variations.length==0 ||
        (elem.item_data.variations.length==1&&
          (elem.item_data.variations[0].is_deleted || elem.item_data.variations[0].item_variation_data==null))
        )      
      // no variations -- return a single row with the generic header information
      return [{is_variation_row: false, name: elem.item_data.name, category_id: elem.item_data.category_id,
                present_at_all_locations: elem.present_at_all_locations, present_at_location_ids: elem.present_at_location_ids,
                absent_at_location_ids: elem.absent_at_location_ids, sku: "",
                in_stock: "-",
                price: "-"}];
    else if (elem.item_data.variations.length==1) { // a single valid variation     
      // return a single row with information about the only variation     
      let price="";
      if (elem.item_data.variations[0].item_variation_data.price_money) {
        price=elem.item_data.variations[0].item_variation_data.price_money.amount; 
      }                           
      return [{is_variation_row: false, name: elem.item_data.name, category_id: elem.item_data.category_id,
              present_at_all_locations: elem.present_at_all_locations, present_at_location_ids: elem.present_at_location_ids,
              absent_at_location_ids: elem.absent_at_location_ids, sku: elem.item_data.variations[0].item_variation_data.sku,
              in_stock: "tbd use inv api",
              price: price}];
      
     
    } else { 
      // many variations     
      let variations = elem.item_data.variations.filter(variation=>!variation.is_deleted && variation.item_variation_data!=null     
                          );
      let variationsList=variations.map(variation=>{
        let price="";
        if (variation.item_variation_data.price_money) {
          price=variation.item_variation_data.price_money.amount; 
        } 
        return {is_variation_row: true, name: variation.item_variation_data.name, category_id: elem.item_data.category_id,
                present_at_all_locations: variation.present_at_all_locations, present_at_location_ids: variation.present_at_location_ids,
                absent_at_location_ids: variation.absent_at_location_ids, sku: variation.item_variation_data.sku,
                in_stock: "tbd use inv api",
                price: price};
      });

      /* -- Explanation of how the apply function works (I'm using it to find max/min values)

      from this link https://stackoverflow.com/questions/4020796/finding-the-max-value-of-an-attribute-in-an-array-of-objects
      Math.max.apply(Math, array.map(function(o) { return o.y; }))
      apply function explained here https://stackoverflow.com/questions/21255138/how-does-the-math-max-apply-work
      Basically first parm is your own context or the "this" object, in our case the Math object -- actually for max function
      it could be anything since Max does not depend on the context.
      The second parameter is the values against which the function (max) should be applied
      */

      // return a header row with the generic information prepended to all of the variations      
      return [{is_variation_row: false, name: elem.item_data.name, category_id: elem.item_data.category_id,
                present_at_all_locations: elem.present_at_all_locations, present_at_location_ids: elem.present_at_location_ids,
                absent_at_location_ids: elem.absent_at_location_ids, sku: elem.item_data.variations.length+" Variations",
                in_stock: "tbd use inv api",
                max_price: Math.max.apply(Math, variations.filter(variation=>variation.item_variation_data.price_money).map(
                  variation=>variation.item_variation_data.price_money.amount)
                ),
                min_price: Math.min.apply(Math, variations.filter(variation=>variation.item_variation_data.price_money).map(
                  variation=>variation.item_variation_data.price_money.amount)
                ),
              }, 
              ...variationsList];      
    }
  }
  
  // Determine the name of the category
  private determineCategory(elem, categoryList) {
   if (!elem.is_variation_row)
      if (elem.category_id) 
        return categoryList.find(catg=>catg.id==elem.category_id).category_data.name; 
      else
        return "-"
   else 
      return "";
  }

  // Determine price
  private determineElemPrice(elem) { 
   if (elem.max_price && elem.min_price) { 
     if (elem.max_price == elem.min_price) 
        return this.determinePrice(elem.min_price);
     else // min different from max_price
       return this.determinePrice(elem.min_price) + " - " + this.determinePrice(elem.max_price);
   } else // not a price range
    return this.determinePrice(elem.price);
  }

  // Determine price
  private determinePrice(price) { 
   if (!price) 
     return "";
   else if (price==="-")
     return price;
   else
    return "$"+(price/100).toFixed(2); 
  }
  
  // Determine the locations that the item is available
  private determineLocations(elem, locations) { 
   if (elem.present_at_all_locations) {
     if (!elem.absent_at_location_ids || elem.absent_at_location_ids.length==0)
        return "All Locations";
     else
        return locations.length-elem.absent_at_location_ids.length+" Locations"  
   } else if (elem.present_at_location_ids&&elem.present_at_location_ids.length>0) {
     if (elem.present_at_location_ids.length>1) {
       return elem.present_at_location_ids.length+" Locations";
     } else {
       return locations.find(location=>location.id==elem.present_at_location_ids[0]).name; 
     }

  } else {
     return "";
  } 
 }
  
  // Search Catalog
  private searchCatalog(srch, types) {     
    //this.squarePaymentService.findCatalogObjectsByName(srch, types) 
    this.squarePaymentService.findCatalogObjectsByPrefix(srch, types)  
      .subscribe({
            next(response) { /*console.log('data: ', response);*/ 
            },
            error(err) { //self.formError = err.message;
                        console.log('Some error '+err.message); 
            }
      });
  }
  
  // to handle a payment trasaction through Payment form
  // this is for the case where you are providing the client UI to capture credit card details
  // In order for this to work you need to ensure that the sandbox token is being used on the node back end server
  // Check gmail and follow the instructions and update the access token variable so it uses the sandbox
  private processCardPayment() {   
    let nonce = (<HTMLInputElement>document.getElementById('card-nonce')).value
    this.squarePaymentService.processPayment({"nonce": nonce} as SquareProcessPaymentRequest)      
      .subscribe({
            next(response) { /*console.log('data: ', response);*/ 
            },
            error(err) { //self.formError = err.message;
                        console.log('Some error '+err.message); 
            }
      });
  }
  
  // to handle a payment trasaction using Square's checkout interface
  // Basically you'll capture the order details and pass it to Square's checkout and let it handle the
  // UI interaction for billing 
  private processCheckout() { 
    let order : Order = {
        reference_id: 'reference_id',
        line_items: [
          {
            name: 'Printed T Shirt',
            quantity: '2',
            base_price_money: {amount: 1500, currency: 'USD'},
            discounts: [
              {
                name: '7% off previous season item',
                percentage: '7'
              },
              {
                name: '$3 off Customer Discount',
                amount_money: {amount: 300, currency: 'USD'}
              }
            ]
          },
          {
            name: 'Slim Jeans',
            quantity: '1',
            base_price_money: {amount: 2500, currency: 'USD'}
          },
          {
            name: 'Woven Sweater',
            quantity: '3',
            base_price_money: {amount: 3500, currency: 'USD'},
            discounts: [
              {
                name: '$11 off Customer Discount',
                amount_money: {amount: 1100, currency: 'USD'}
              },
              {
                name: 'Fair Trade Tax',
                percentage: '5'
              }
            ]
          },
        ],
        discounts: [
          {
            name: "Father's day 12% OFF",
            percentage: '12'
          },
          {
            name: 'Global Sales $55 OFF',
            amount_money: {amount: 5500, currency: 'USD'}
          }
        ],
        taxes: [
          {
            name: 'Sales Tax',
            type: 'ADDITIVE',
            percentage: '8.5'
          }
        ]
      };
    
    let checkout: SquareCheckout = {
      order : order,
      ask_for_shipping_address: true,
      merchant_support_email: 'merchant+support@website.com',
      pre_populate_buyer_email: 'example@email.com',
      pre_populate_shipping_address: {
        address_line_1: '1455 Market St',
        address_line_2: 'Suite 600',
        locality: 'San Francisco',
        administrative_district_level_1: 'CA',
        postal_code: '94103',
        country: 'US',
        first_name: 'Jane',
        last_name: 'Doe'
      }
      // redirect_url: 'https://www.example.com/checkout-order-confirm'
    }
    // ... to do ... capture order details and pass it to process checkout.  For now just pass a placeholder
    //let dummyOrder = { }; // dummy order
    let self=this;
    // opened the window in two steps as recommended here https://stackoverflow.com/questions/2587677/avoid-browser-popup-blockers
    // however it doesn't seem to prevent it from being blocked by the pop up blocker
    //let newTab = window.open();
    this.squarePaymentService.processCheckout(checkout)      
      .subscribe({
            next(response) { /*console.log('data: ', response);*/ 
              self.document.location.href = response;  // to open in same tab
             // self.window.open(response, '_blank'); // open in a new window or tab (disadvantage is that individual 
                                                    // may need to disable popup blocker to view site
              //newTab.location.href = response; // an attempt at getting past the pop up blocker -- don't work all of the time
            },
            error(err) { //self.formError = err.message;
                        console.log('Some error '+err.message); 
            }
      });
  }


}
