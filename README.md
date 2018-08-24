# keqgplxoapv.angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Notes about changes for Cross Origin Resource Sharing

Requests to the real town of babylon web site need to be proxied to enable cross-origin sharing.

   Basically, I tried to use their search "api" at https://www.townofbabylon.com/Search/AutoComplete?term='xxx' to return documents that
   match the search string".  Unfortunately, this is a security exposure and the server (i.e. town of babylon website) need to recognize
   the request from my site with the Access-Control-Allow-Origin response header.  Since I have no control over this, I'm using this
   alternate method, by proxying the town of babylon site, to get around this problem. But the true fix would be for the town of babylon
   site to return the Access-Control-Allow-Origin header acknowledging that the request coming from my site is valid 
   
   The approach used here is documented, about quarter of the way into the page, at 
   https://stackoverflow.com/questions/34790051/how-to-create-cross-domain-request
   
   **** Note the following changes were made and would need to be rolled back if this change is removed.  I could not add comments to
        any of the JSON files because JSON files do not support comments
        
        _ The proxy.conf.json file was added to the project. It is under the src directory. In this file you
           may also define the level of messages being issue by adding the following attribute under the ChangeOrigin attribute
              /*,"logLevel": "debug" -- Possible options for logLevel include debug, info, warn, error, and silent (default is info) */
        _ Configuration file angular.json has ben updated to add proxyConfig to the options property of the "serve" attribute 
        located under "build". 
        _ the package.json file has been updated to add the proxy-config option to the "start" command
           "start": "ng serve --host 0.0.0.0 --disable-host-check --proxy-config proxy.conf.json",
        _ search.service.ts has been updated to use a proxied reference to the url for the town of babylon web site. A rewrite rule 
          in proxy.conf.json will then point it to the actual town of babylon site
         return this.http.get<SearchDoc[]>('/Search/AutoComplete'   *** new
         return this.http.get<SearchDoc[]>('https://www.townofbabylon/Search/AutoComplete'   *** old
