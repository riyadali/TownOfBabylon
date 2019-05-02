// a good discussion on Hostlistener can be found here 
// https://medium.com/claritydesignsystem/four-ways-of-listening-to-dom-events-in-angular-part-2-hostlistener-1b66d45b3e3d
import { AfterViewInit, Component, OnInit, Inject, TemplateRef, ViewChild, HostListener } from '@angular/core';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { DOCUMENT } from '@angular/common';

import { SquareProcessPaymentRequest } from '../../model/SquareProcessPaymentRequest';
import { Order } from '../../model/Order';
import { SquareCheckout } from '../../model/SquareCheckout';

import { SquarePaymentService } from '../../payment-square.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import modalTemplate from "../../modal-views/modal.template.html";
import clickShoppingItemTemplate from "../../modal-views/click-shopping-item.template.html";
import mainTemplate from "./payment-square.component.html";

declare var SqPaymentForm : any; //magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'app-payment-square',
  template: modalTemplate+mainTemplate+clickShoppingItemTemplate,
  styleUrls: ['./payment-square.component.scss']
})
export class PaymentSquareComponent implements OnInit, AfterViewInit {
  
  private msgid=0; // used to keep messgaes unique so they are not grouped

  constructor(private squarePaymentService: SquarePaymentService, private modalService: BsModalService,
               @Inject('Window') private window: Window, @Inject(DOCUMENT) private document: any
    ) { }
  
  // a good discussion on Hostlistener can be found here 
  // https://medium.com/claritydesignsystem/four-ways-of-listening-to-dom-events-in-angular-part-2-hostlistener-1b66d45b3e3d
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    console.log("....in document's click handler"+ ++this.msgid);
    // your click logic
    // for Element attributes refer to https://developer.mozilla.org/en-US/docs/Web/API/Element
    // for HTMLElement attributes refer to https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
    //console.log("....clicked"+JSON.stringify((event.target as HTMLElement).style))
    //console.log("....clicked"+JSON.stringify((event.target as HTMLElement)))
    //console.log("....clicked"+(event.target as HTMLElement).outerHTML)
   
    // stop propagation only works from child going to parent ... not the other way around
    // refer to this reference https://stackoverflow.com/questions/28210108/how-to-stop-propagating-event-from-parent-div-to-child-div
    // event.stopPropagation();
    
    // On first call in attach click handler to the category popover
    // This click handler will stop propagation of clicks to the 
    // document click handler.
    // The document click handle automatically closes the category popover on clicks and you don't
    // want this to happen by default if the click is within the popover.  Let the popover's handlers determine
    // what needs to be done.
    if (!this.catPopoverDOMElement) { // popover only attached when category button clicked
       let catPopovers=this.getPopoversContainingElementWithClass("catpopover"); // hopefully only one found
       if (catPopovers && catPopovers.length!=0) {
          this.catPopoverDOMElement=catPopovers[0] as HTMLElement; 
          this.catPopoverDOMElementDescendants = this.getDescendants(this.catPopoverDOMElement);         
          // now add a click handler to the targeted popover
          this.catPopoverDOMElement.addEventListener("click", event => {
            console.log(".____________..executing cat popovers event listener"+this.msgid);
            event.stopPropagation();
          });
          console.log("...attaching category popover click handler completed")
       }
    }
    
    // ensure DOM element built and click handler attached (See code below).  Otherwise, we will immediately
    // try to close popover on the first click inside of it   
    let clickedElem =  event.target as HTMLElement;  
    if (this.categoryPopoverViewElement&&this.catPopoverDOMElement // popover attached
        &&clickedElem!=this.catPopoverDOMElement    // and click not within popover ...
        &&Array.prototype.indexOf.call(this.catPopoverDOMElementDescendants, clickedElem)<0) {  // ... or its descendants
      //console.log(">>>>>>>categoryPopoverViewElement"+this.msgid+this.categoryPopoverViewElement)
      this.categoryPopoverViewElement.hide();
      this.catPopoverDOMElement=null;
      // console.log(">>>>hide criteria met"+this.msgid)
      // console.log("tgt"+this.msgid+(event.target as HTMLElement).innerHTML)
    }
    
  }
  
  private getDescendants(elem) {
   return elem.querySelectorAll("*"); // returns a NodeList (not an array)
  }
  
  private getPopoversContainingElementWithClass(targetClass) {
    let body = document.getElementsByTagName("BODY")[0]; // get Body elementId
    
    // find all popovers ... note the popover content is wrapped by a div with class name "popover-body"
    // Note -- Array.from needed refer to https://stackoverflow.com/questions/47492595/why-foreach-does-not-exist-on-nodelistof
    let popovers = Array.from(body.getElementsByClassName("popover-body"));
    return popovers.filter(popover=>this.elementContainsElementWithClass(popover,targetClass));   
  }

  // check if element has element below it in the DOM hierarchy with the target class
  private elementContainsElementWithClass(element, targetClass) {
    // Note -- Array.from needed refer to https://stackoverflow.com/questions/47492595/why-foreach-does-not-exist-on-nodelistof
    let tgtElems =  Array.from(element.getElementsByClassName(targetClass));
    if (tgtElems && tgtElems.length!=0) {
      return true;
    } else
      return false;
  }
  
  // temp code to experiment with popover
  private closePopover(pop) {
    console.log(".....hiding popover")
    pop.hide()
  }
  
  private modalRef: BsModalRef;
  
  private openModal(template: TemplateRef<any>) {
    //this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.modalRef = this.modalService.show(template);
  }
  
  // button 1 on modal is treated as submit button
  private onSubmit() {
    // for now do nothing
  }
  
  private modalButton2Clicked() {
    this.modalRef.hide();
  }  
  
  
  @ViewChild('modalContent')
  private modalContent: TemplateRef<any>;
  
  @ViewChild('clickShoppingItemContent')
  private clickShoppingItemContent: TemplateRef<any>;  
  
  private modalData: {
    bodyTemplate: TemplateRef<any>;
    header: string;
    button1Text: string;
    button2Text?: string;
    button3Text?: string;
   // action: string;
    //event: CalendarEvent<ExtraEventData>;
  };

  paymentForm; //this is our payment form object
  private shopButtonClicked: boolean;
  
  private skuCheckbox = false;
  private categoryCheckbox = true;
  private locationsCheckbox = true;
  private inStockCheckbox = true;
  private priceCheckbox = true;
  // Any expanded group will be added as a boolean property to this object and it will be set to true.  The property
  // would be named using the group_id field and can referenced as follows: groupExpanded[group_id]
  private groupExpanded = {}; 
  
  private hoveringOnItem=false;
  private hoverItemIndex=0; // no item being hovered on
  
  private currentShoppingItem; // for modal dialog
  
  /*
  private unfilteredShoppingItems = [
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
  */
 
  private unfilteredShoppingItems;
  private filteredShoppingItems; // the shopping items filtered based on user display selection criteria
  
  /*
  private availableCategories = [
    {
      name: "All Categories",
      checked: true
    },
    {
      name: "Beverages"
    },
    {
      name: "Sports"
    }
  ];
  */
  private availableCategories;
  private filteredCategories; // categories filtered by user input
  private selectedCategory="All Categories"; // initially all categories selected
  //private catButtonClicked: boolean;
  private catFilter;
  private categoryPopoverViewElement;
  private catPopoverDOMElement;
  private catPopoverDOMElementDescendants;
  
  private availableLocations;
  private filteredLocations; // locations filtered by user input
  private locationButtonText="All Locations"; // initially all locations selected
  private locationPopoverOpen: boolean;
  private locationButtonClicked: boolean;
  private locationFilter;
  
  // initialize shopping item list -- concept gotten from this link https://stackoverflow.com/questions/52949215/how-to-subscribe-on-variable-changes and this one     https://stackoverflow.com/questions/48452073/angular-waiting-for-a-method-to-finish-or-a-variable-to-be-initialized
  private _availableShoppingItems;
  private _availableShoppingItems$ = new BehaviorSubject(this._availableShoppingItems);

  private set availableShoppingItems(value) {
    this._availableShoppingItems = value;
    this._availableShoppingItems$.next(this._availableShoppingItems);
  }
  private get availableShoppingItems() {
    return this._availableShoppingItems$.asObservable();
  }

  ngOnInit() {
    let self=this;
    
    this.listCatalog('CATEGORY,ITEM'); // initialize shopping item list 
    
    // Set the application ID for Square
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
  
   // handle click of shopButtonClicked
  private shopButtonClickHandler() {
    let self=this;    
    if (!this.filteredShoppingItems) {
      // list not built yet -- wait for item list build to complete
      // note with subscription in place this code will 
      // execute on any future change to availableShoppingItems 
      this.availableShoppingItems.subscribe(value => {
        //console.log("_________"+JSON.stringify(value))
        self.filteredShoppingItems = value;
        if (!self.unfilteredShoppingItems) {
          // base list of shopping items not set yet
          self.unfilteredShoppingItems = value;
        }
      });
    }
    if(this.shopButtonClicked) {
      this.shopButtonClicked = false;
    } else {
      this.shopButtonClicked = true;
    }
  }
  
  // Handle click of Category button
  categoryButtonClickHandler(catButton, catPopover) {
    console.log("...start of category button click handler")
    //console.log(":::::"+(catButton as HTMLElement).outerHTML);
    //this.catButtonClicked=true; // indicate that category button clicked at least once
    //console.log("On entry popover showing is "+this.+catPopover.isOpen)
    // if category popover is closed on entry then pull the category records for display
    let self=this;
    if (!catPopover.isOpen) {
       this.categoryPopoverViewElement=catPopover;
       // get a list of Categories from Square
       this.squarePaymentService.listCatalog("CATEGORY")
          .subscribe({
            next(response) { /*console.log('data: ', response);*/  
              self.availableCategories=response.objects.filter(elem=>!elem.is_deleted && elem.category_data)
                    .map(elem=>{  
                                return { name: elem.category_data.name
                                  
                                };
                              });
              // Include the "All Categories" category at the start of the list
              self.availableCategories.unshift({
                                        name: "All Categories"
                                      });
              if (!self.availableCategories.find(cat=>cat.name==self.selectedCategory)) {
                // previously selected category no longer found -- default to "All Categories"
                self.selectedCategory="All Categories";
                self.switchCategory(self.selectedCategory); // refresh shopping item list
              }
              self.availableCategories.find(cat=>cat.name==self.selectedCategory).checked=true;
              
              self.filteredCategories=self.buildfilteredCategories(); // keep filtered list in synch
            }, // end next for listCatalog
            error(err) { //self.formError = err.message;
              console.log('Some error '+err.message); 
            }
          }); // end subscribe for listCatalog
    } else {
      // popover was open to begin with. So toggle will close it .. clear the corresponding DOM element
      this.catPopoverDOMElement=null;
    }
    catPopover.toggle();
  }
  
  // Handle click of Location button
  locationButtonClickHandler() {
    this.locationButtonClicked=true; // indicate that location button clicked at least once
    //console.log("On entry popover showing is "+this.locationPopoverOpen)
    // if location popover is closed on entry then pull the location records for display
    let self=this;
    if (!this.locationPopoverOpen && !this.availableLocations) {
       // get a list of Locations from Square
       this.squarePaymentService.listLocations()
          .subscribe({
            next(response) { /*console.log('data: ', response);*/  
              self.availableLocations=response.locations.filter(elem=>!elem.is_deleted)
                    .map(elem=>{  
                                // wrap location detail in an object
                                // this would ensure that the filtered and unfiltered version of the
                                // location array will refer to the same element details
                                // The filter method on an array creates a shallow copy which is what I need.
                                // The wrapper locationObjects are distinct in the filtered and unfiltered
                                // arrays but the underlying elements share the same details.
                                // By doing this you don't have the hassle of keeping the element details
                                // synchronized between the filtered and unfiltered arrays  
                                return { locationObject: { 
                                                            name: elem.name,
                                                            checked: true
                                                          }
                                       };
                              });
              // Include the "All Locations" location at the start of the list
              self.availableLocations.unshift({ locationObject: { 
                                                                  name: "All Locations",
                                                                  checked: true
                                                                }
                                              });             
              
              self.filteredLocations=self.availableLocations; // keep filtered list in synch
              //self.filteredLocations=self.buildfilteredLocations(); // keep filtered list in synch
            }, // end next for listLocations
            error(err) { //self.formError = err.message;
              console.log('Some error '+err.message); 
            }
          }); // end subscribe for listLocations
    }
    this.locationPopoverOpen=!this.locationPopoverOpen;
  }
  
  // Handle clear of category filter
  private catFilterClearClickHandler() {
    this.catFilter=null;
    this.filteredCategories=this.buildfilteredCategories(); 
  }
  
  // Handle clear of location filter
  private locationFilterClearClickHandler() {
    this.locationFilter=null;
    this.filteredLocations=this.buildfilteredLocations(); 
  }
  
  // Handle change to the category filter
  private onCatFilterChange(catFilter) { 
    this.catFilter=catFilter;       
    // console.log("filter text is "+catFilter)
    // build new filtered category list 
    this.filteredCategories=this.buildfilteredCategories();       
  }
  
  // Handle change to the location filter
  private onLocationFilterChange(locFilter) { 
    this.locationFilter=locFilter;       
    // console.log("filter text is "+locFilter)
    // build new filtered location list 
    this.filteredLocations=this.buildfilteredLocations();       
  }
  
  private buildfilteredCategories() {
    if (!this.catFilter)
      return this.availableCategories;
    else {
      return this.availableCategories.filter(catg=>catg.name.toLowerCase().indexOf(this.catFilter.toLowerCase())!=-1||
                                                  catg.name=="All Categories");      
    }    
  }
  
  private buildfilteredLocations() {
    if (!this.locationFilter)
      return this.availableLocations;
    else {
      return this.availableLocations.filter(locn=>locn.locationObject.name.toLowerCase().indexOf(this.locationFilter.toLowerCase())!=-1||
                                                  locn.locationObject.name=="All Locations");      
    }    
  }
  
  // handle selection change on category radio button
  onCategorySelectionChange(category) {        
    // console.log("selected category is "+this.selectedCategory)
    // unselected existing choice
    this.availableCategories.find(cat=>cat.checked).checked=false; 
    // check the new item
    let tgtCat=this.availableCategories.find(cat=>cat.name==this.selectedCategory);
    if (tgtCat)
      tgtCat.checked=true;
        
    this.filteredCategories=this.buildfilteredCategories(); // keep filtered categories in synch 
    
    this.switchCategory(this.selectedCategory); // refresh shopping item list
  }
  
  // handle selection change on location radio button
  onLocationSelectionChange(locn, idx) {        
    //console.log("selected Location is "+JSON.stringify(locn))
    if (locn.locationObject.name=="All Locations") {
      if (locn.locationObject.checked) {
        // ensure all other locations in filtered view checked
        this.filteredLocations.forEach(locn=>{
          if (locn.locationObject.name!="All Locations") {
            locn.locationObject.checked=true;
          }
        });
      } else {
        // ensure all other locations in filtered view not checked
        this.filteredLocations.forEach(locn=>{
          if (locn.locationObject.name!="All Locations") {
            locn.locationObject.checked=false;
          }
        });
      }
    } else { // not all locations
      if (locn.locationObject.checked==true) {
        // if all locations now checked ensure "All Locations" checked
        if (!this.filteredLocations.find(locn=>locn.locationObject.checked==false&&locn.locationObject.name!=="All Locations")) {
          this.filteredLocations.find(locn=>locn.locationObject.name=="All Locations").locationObject.checked=true;
        }
      } else {
        // ensure that "All Locations" not checked
        this.filteredLocations.find(locn=>locn.locationObject.name=="All Locations").locationObject.checked=false;
      }

    }
    //this.filteredLocations=this.buildfilteredLocations(); // keep filtered locations in synch 
    
    // change text for location button
    this.locationButtonText=this.buildLocationButtonText();
    
    this.filteredShoppingItems=this.filterShoppingItems();
    //this.switchLocation(this.locationButtonText); // refresh shopping item list
  }
  
  // build location button text 
  private buildLocationButtonText() {
    let checkedLocations =  this.availableLocations.filter(
                                  locn=>locn.locationObject.checked==true&&locn.locationObject.name!=="All Locations");
    if (checkedLocations.length==0)
      return "No Locations";
    else if (checkedLocations.length==1)
      return checkedLocations[0].locationObject.name;
    else if (checkedLocations.length==this.availableLocations.length-1)
      return "All Locations";
    else
      return checkedLocations.length+" Locations";
  }
  
  // switch to selected category
  private switchCategory(newCategory) {
    this.filteredShoppingItems=this.filterShoppingItems();
  }
  
  /* -- not used
  // switch to selected location
  private switchLocation(newLocation) {
    this.filteredShoppingItems=this.filterShoppingItems();
  }
  */

  private filterShoppingItems() {
    let results=this.unfilteredShoppingItems;

    // filter by location
    if (this.locationButtonText!="All Locations") {
      let checkedLocations =  this.availableLocations.filter(
                                  locn=>locn.locationObject.checked==true&&locn.locationObject.name!=="All Locations").map(locn=>{
                                      return locn.locationObject.name;
                                  });
      results=results.filter(item=>{
                if (item.locationsNames.indexOf("All Locations")!=-1)
                  return true;
                else {                  
                  let result=false;              
                  item.locationsNames.forEach(locn=>{ 
                      if (checkedLocations.indexOf(locn)!=-1) {
                        result=true;
                      }
                  });                  
                  return result;
                }         
      });
    }

    // filter by category
    if (this.selectedCategory!="All Categories") {
      results=results.filter(item=>item.baseCategory==this.selectedCategory);
    }
    
    return results;
  }
  
  // build shopping item list based on selected category
  // -- code no longer being executed.  I was invoking it on every change in the category selection
  // -- in an effort to keep the display as up to date as possible with the backend.
  // -- But this resulted in a slow UI experience.  So now I only go to the backend once to
  // -- retrieve all possible items and then filter that list to meet the users UI needs.
  private buildItemList(catg?) {
    this.availableShoppingItems=null; // clear existing list in case it takes a while to retrieve new list
    // build new list of shopping items
    this.listCatalog('CATEGORY,ITEM', catg);    
  }
  
  // display image when hovering over item
  private mouseOverItemHandler(i) {
    //console.log("hovering")
    this.hoveringOnItem=true;
    this.hoverItemIndex=i;
  }
  private mouseOutItemHandler(i) {
    //console.log("not hovering")
    this.hoveringOnItem=false;
    this.hoverItemIndex=0;
  }
  // determine wheter image sould be displayed for shopping item_data
  private showImage(i) {
    if (this.hoveringOnItem && i==this.hoverItemIndex)
      return true;
    else
      return false;    
  }  
  // handle click of shopping table row
  private shoppingTableRowClickHandler(elem) {
    //console.log("row clicked is "+JSON.stringify(elem))
    this.currentShoppingItem = elem;
    this.modalData = {                      
                      bodyTemplate:  this.clickShoppingItemContent, 
                      header: "Details", 
                      button1Text: "More", 
                      button2Text: "Return" 
                    };
    this.openModal(this.modalContent);
  }
  
  // handle click of dropdown button in shopping table row
  private shoppingTableRowDropdownClickHandler(elem) {
    //console.log("dropdown clicked is "+JSON.stringify(elem));
    
    if (this.groupExpanded[elem.group_id]) {
       // group currently expanded
       this.groupExpanded[elem.group_id]=false;
     } else {
       // group currently collapsed
       this.groupExpanded[elem.group_id]=true;
     }
  }
    
  // Get list of Catalog items
  private listCatalog(types, catFilter?) {   
    let self=this;   
    this.squarePaymentService.listCatalog(types)      
      .subscribe({
            next(response) { /*console.log('data: ', response);*/
               let categoryList=response.objects.filter(elem=>elem.type==="CATEGORY"&&elem.category_data);
               self.squarePaymentService.listLocations()
                .subscribe({
                    next(resp) { /*console.log('data: ', resp);*/
                      let locations=resp.locations;
                      self.squarePaymentService.listTaxes()
                       .subscribe({
                         next(resp) {
                           let taxes=resp.objects;
                           let itemList=response.objects.filter(elem=>elem.type==="ITEM" && !elem.is_deleted
                              && elem.item_data)
                           if (catFilter) {
                              itemList=itemList.filter(elem=>elem.item_data.category_id&&
                                                       catFilter==self.getCatNameFor(elem.item_data.category_id,categoryList));
                            }
                           self.availableShoppingItems=itemList.flatMap(                           
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
                                  category: self.determineCategory(elem,categoryList),
                                  baseCategory: self.determineBaseCategory(elem,categoryList),
                                  locations: self.determineLocations(elem,locations),
                                  locationsNames: self.determineLocationsNames(elem,locations),
                                  inStock: elem.in_stock,
                                  is_variation_row: elem.is_variation_row,
                                  group_id: elem.group_id,
                                  description: elem.description,
                                  image_url: elem.image_url,
                                  taxes: self.determineTaxes(elem, taxes)
                                };
                              }); 
                          }, // end next for listTaxes
                          error(err) { //self.formError = err.message;
                            console.log('Some error '+err.message); 
                          }
                       }); // end subscribe for listTaxes
                    }, // end next aftter locations lookup
                    error(err) { //self.formError = err.message;
                      console.log('Some error '+err.message); 
                    }
                }); // end subscribe for listLocations
            }, // end next for listCatalog
            error(err) { //self.formError = err.message;
                        console.log('Some error '+err.message); 
            }
      }); // end subscribe for listCatalog
  }
  
  // Add variations as individual rows as well as a header row for generic version of item
  private addVariations(elem): Array<any> {
    //console.log("Elemnt is "+JSON.stringify(elem));
    if (elem.item_data.variations==null||elem.item_data.variations.length==0 ||
        (elem.item_data.variations.length==1&&
          (elem.item_data.variations[0].is_deleted || elem.item_data.variations[0].item_variation_data==null))
        )      
      // no variations -- return a single row with the generic header information
      return [{is_variation_row: false, name: elem.item_data.name, category_id: elem.item_data.category_id,
                present_at_all_locations: elem.present_at_all_locations, present_at_location_ids: elem.present_at_location_ids,
                absent_at_location_ids: elem.absent_at_location_ids, sku: "",
                description: elem.item_data.description,
                tax_ids: elem.item_data.tax_ids,
                in_stock: "-",
                image_url: elem.item_data.image_url,
                price: "-"}];
    else if (elem.item_data.variations.length==1) { // a single valid variation     
      // return a single row with information about the only variation as well as a header row for generic version of item    
      let price="";
      if (elem.item_data.variations[0].item_variation_data.price_money) {
        price=elem.item_data.variations[0].item_variation_data.price_money.amount; 
      }                           
      return [{is_variation_row: false, name: elem.item_data.name, category_id: elem.item_data.category_id,
              present_at_all_locations: elem.present_at_all_locations, present_at_location_ids: elem.present_at_location_ids,
              absent_at_location_ids: elem.absent_at_location_ids, sku: elem.item_data.variations[0].item_variation_data.sku,
              description: elem.item_data.description,
              tax_ids: elem.item_data.tax_ids,
              group_id: elem.id,
              in_stock: "tbd use inv api",
              image_url: elem.item_data.image_url,
              price: price},
              {is_variation_row: true, name: elem.item_data.variations[0].item_variation_data.name, 
                category_id: elem.item_data.category_id, 
                present_at_all_locations: elem.item_data.variations[0].present_at_all_locations, 
                present_at_location_ids: elem.item_data.variations[0].present_at_location_ids,
                absent_at_location_ids: elem.item_data.variations[0].absent_at_location_ids, 
                sku: elem.item_data.variations[0].item_variation_data.sku, 
                group_id: elem.id,
                description: "",
                in_stock: "tbd use inv api",
                image_url: elem.item_data.image_url,
                price: price}
              ];
      
     
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
                group_id: elem.id,
                description: "",
                in_stock: "tbd use inv api",
                image_url: elem.item_data.image_url,
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
                group_id: elem.id,
                description: elem.item_data.description,
                tax_ids: elem.item_data.tax_ids,
                in_stock: "tbd use inv api",
                image_url: elem.item_data.image_url,
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
  
  // Determine the name of the category -- this is what is displyed in the report
  private determineCategory(elem, categoryList) {
   if (!elem.is_variation_row)
      if (elem.category_id) 
        return this.getCatNameFor(elem.category_id, categoryList); 
      else
        return "-"
   else 
      return "";
  }
  
  // Determine the name of the category -- the base category is used for filtering
  private determineBaseCategory(elem, categoryList) {
    if (elem.category_id) 
      return this.getCatNameFor(elem.category_id, categoryList); 
    else
      return "-"
  }
  
  // Given a category id determine its name
  private getCatNameFor(catId, categoryList) {
    let tgtCat=categoryList.find(catg=>catg.id==catId);
    if (tgtCat)
      return tgtCat.category_data.name;
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
 
 // Build array of locations item can be found.  If it is present in all locations an array with a single element
 // containing "All Locations" will be returned
  
 private determineLocationsNames(elem, locations) { 
   if (elem.present_at_all_locations) {
     if (!elem.absent_at_location_ids || elem.absent_at_location_ids.length==0)
        return ["All Locations"];
     else
        return locations.filter(locn=>elem.absent_at_location_ids.indexOf(locn.id)==-1)
                        .map(locn=>{
                          return this.getLocationNameFor(locn.id, locations)
                        })  
   } else if (elem.present_at_location_ids&&elem.present_at_location_ids.length>0) {
     if (elem.present_at_location_ids.length>1) {
       return locations.filter(locn=>elem.present_at_location_ids.indexOf(locn.id)!=-1)
                        .map(locn=>{
                          return this.getLocationNameFor(locn.id, locations)
                        })  
     } else {
       return [locations.find(location=>location.id==elem.present_at_location_ids[0]).name]; 
     }

  } else {
     return [];
  } 
}

// Given a location id determine its name
private getLocationNameFor(locId, locationList) {
    let tgtLoc=locationList.find(locn=>locn.id==locId);
    if (tgtLoc)
      return tgtLoc.name;
    else
      return "";
}
  
  // Determine the taxes for the item
  private determineTaxes(elem, availableTaxes) {
   if (!elem.tax_ids||elem.tax_ids.length==0){
     // no Taxes     
     return "";
   } else if (elem.tax_ids.length>2) { 
     // More than two taxes
     if (elem.tax_ids.length==availableTaxes.length)
        return "All Taxes";
     else
        //return locations.length-elem.absent_at_location_ids.length+" Locations"
        return elem.tax_ids.length+" Taxes"  
   } else if (elem.tax_ids.length==2) {
      // two taxes
      return availableTaxes.find(tax=>tax.id==elem.tax_ids[0]).tax_data.name+" and "+availableTaxes.find(tax=>tax.id==elem.tax_ids[1]).tax_data.name; 
   } else {
      // a single tax
      return availableTaxes.find(tax=>tax.id==elem.tax_ids[0]).tax_data.name;
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
