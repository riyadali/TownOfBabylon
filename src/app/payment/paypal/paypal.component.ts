import { Component, OnInit } from '@angular/core';
import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
 
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PayPalComponent implements OnInit {

// Refer to these links https://github.com/Enngage/ngx-paypal (angular 6 paypal) and also https://www.npmjs.com/package/ngx-paypal 
public payPalConfig?: PayPalConfig;
 
  ngOnInit(): void {
    this.initConfig();
  }
 
  private initConfig(): void {
    // For PayPal customization refer to this link https://developer.paypal.com/docs/checkout/reference/customize-sdk/#
    
    // refer to this link https://github.com/Enngage/ngx-paypal/blob/master/projects/ngx-paypal-lib/src/lib/models/paypal-models.ts
    // for a definition of all the interfaces
    
    // To disable certain cards refer to this link https://developer.paypal.com/docs/checkout/reference/customize-sdk/#disable-funding
    this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
      commit: true,
      client: {
        /* steps for generating credentials ...
           1) go to "My Apps & Credentials" at https://developer.paypal.com/developer/applications/
           2) under "REST API Apps" click "Create App" button
           3) click on that app to get "Client ID" Credentials
           4) by default you are under the sandbox tab so you'll get the sandbox Credentials
           5) You may also get the live credentials -- you may want to ensure that you are not using the live credentials
        */
        sandbox: 'AbTZKC4LxWEIDnwkWUCAL8mpsIovzdGrOZanf5Klr76BNfgnJCd1novcQOT1t7rMOAL7qoVdqx7CtpZB' // from test1 app
      },
      // refer to this site for button customization https://developer.paypal.com/docs/checkout/integration-features/customize-button/
      button: {
        label: 'paypal',
        size: 'responsive', // small, medium, large, or responsive (small does not appear to work)
        layout: 'vertical', // add this line if you want PayPal credit and Visa/Mastercard/Amex/Discover button
        color: 'gold',
        shape: 'pill'       // could also be 'rect'
      },
      onPaymentComplete: (data, actions) => {
        console.log("Transaction completed by "+JSON.stringify(data)+"====="+JSON.stringify(actions));
        alert("Transaction completed by "+JSON.stringify(data)+"====="+JSON.stringify(actions))
      },
      onCancel: (data, actions) => {
        console.log('OnCancel');
      },
      onError: (err) => {
        console.log('OnError');
      },
      /* sample customization to limitf funding sources
      funding: {
        allowed: [PayPalFunding.Credit],  // allow payapal credit button
        disallowed:  [PayPalFunding.Card]  // disallow credit cards     
      },
      */
      transactions: [{
        amount: {
          currency: 'USD',
          total: 9
        }
      }]
      
      /* some of the cofiguration options supported are shown below
         onClick: () => {
            console.log('onClick');
          },
          validate: (actions) => {
            console.log(actions);
          },
          experience: {
            noShipping: true,
            brandName: 'Angular PayPal'
          },
          transactions: [
            {
              amount: {
                total: 30.11,
                currency: 'USD',
                details: {
                  subtotal: 30.00,
                  tax: 0.07,
                  shipping: 0.03,
                  handling_fee: 1.00,
                  shipping_discount: -1.00,
                  insurance: 0.01
                }
              },
              custom: 'Custom value',
              item_list: {
                items: [
                  {
                    name: 'hat',
                    description: 'Brown hat.',
                    quantity: 5,
                    price: 3,
                    tax: 0.01,
                    sku: '1',
                    currency: 'USD'
                  },
                  {
                    name: 'handbag',
                    description: 'Black handbag.',
                    quantity: 1,
                    price: 15,
                    tax: 0.02,
                    sku: 'product34',
                    currency: 'USD'
                  }],
                shipping_address: {
                  recipient_name: 'Brian Robinson',
                  line1: '4th Floor',
                  line2: 'Unit #34',
                  city: 'San Jose',
                  country_code: 'US',
                  postal_code: '95131',
                  phone: '011862212345678',
                  state: 'CA'
                },
              },
            }
          ], // end transactions
          note_to_payer: 'Contact us if you have troubles processing payment'
      */
      
    }); // end PayPalConfig
  }
}
