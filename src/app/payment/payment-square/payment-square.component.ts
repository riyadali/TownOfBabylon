import { AfterViewInit, Component, OnInit } from '@angular/core';

import { SquareProcessPaymentRequest } from '../../model/SquareProcessPaymentRequest';

import { SquarePaymentService } from '../../payment-square.service';

declare var SqPaymentForm : any; //magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'app-payment-square',
  templateUrl: './payment-square.component.html',
  styleUrls: ['./payment-square.component.scss']
})
export class PaymentSquareComponent implements OnInit, AfterViewInit {

  constructor(private squarePaymentService: SquarePaymentService) { }

  paymentForm; //this is our payment form object

  ngOnInit() {
    // Set the application ID
    var applicationId = "sandbox-sq0idp-C6tuS5thsbqmjqa9LGiUyA";

    // Set the location ID
    var locationId = "CBASEFbzlRgZ_4BMSnfPml8y7rQgAQ";
    this.paymentForm = new SqPaymentForm({

      // Initialize the payment form elements
      applicationId: applicationId,
      locationId: locationId,
      inputClass: 'sq-input',
      mediaMaxWidth: '520px', // keep in sync with mediawidth in external styles
    
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
          // The payment request below is provided as
          // guidance. You should add code to create the object
          // programmatically.
          return {
            requestShippingAddress: true,
            currencyCode: "USD",
            countryCode: "US",
            total: {
              label: "Hakuna",
              amount: 1000,
              pending: false,
            },
            lineItems: [
              {
                label: "Subtotal",
                amount: 1000,
                pending: false,
              },
              {
                label: "Shipping",
                amount: 5.75,
                pending: true,
              },
              {
                label: "Tax",
                amount: 6.09,
                pending: false,
              }
            ]
          };
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
    
          alert('Nonce received: ' + nonce); /* FOR TESTING ONLY */
    
          // Assign the nonce value to the hidden form field
          // document.getElementById('card-nonce').value = nonce;
          //needs to be extracted from the
          (<HTMLInputElement>document.getElementById('card-nonce')).value = nonce; //casting so .value will work
          //get this value from the database when the user is logged in
          (<HTMLInputElement>document.getElementById('sq-id')).value = "CBASEC8F-Phq5_pV7UNi64_kX_4gAQ";
    
          // POST the nonce form to the payment processing page
          (<HTMLFormElement>document.getElementById('nonce-form')).submit();
    
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

}
