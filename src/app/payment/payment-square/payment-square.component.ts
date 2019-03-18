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
  
  // build table of items from catalog
  private buildCatalogTable() {     
    this.squarePaymentService.listCatalog("ITEMS")      
      .subscribe({
            next(response) { /*console.log('data: ', response);*/ 
            },
            error(err) { //self.formError = err.message;
                        console.log('Some error '+err.message); 
            }
      });
  }
  
  // Get list of Catalog items
  private listCatalog(types) {     
    this.squarePaymentService.listCatalog(types)      
      .subscribe({
            next(response) { /*console.log('data: ', response);*/ 
            },
            error(err) { //self.formError = err.message;
                        console.log('Some error '+err.message); 
            }
      });
  }
  
  // Search Catalog
  private searchCatalog(srch, types) {     
    this.squarePaymentService.findCatalogObjectsByName(srch, types)      
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
