# Essence
Finally! The package you been waiting for long is already here to abstract all the boring routines you've been doing submissively on every project.
Now nothing can stop you from diving into a business logic right after installation.

### Description
In general this lib consists of three parts that you can use individually or in conjuction with other parts.
Here is some brief description with relative paths where you can read full description:
##### ./src/ui_core
Front-end related part compatible with all modern browsers that includes:
Services to work with api (wrappers around SignalR client and browser's FetchAPI);
Utils and helpers to compute some common operations;
Service worker that provides the best caching strategy; 
React related parts:
    Widely used UI components that are lightweight, perfomant and highly configurable;
    Hook state manager or redux abstractions for those dinosaurs who still uses it :)
    React-router-dom wrapper to provide more declarative interface to build routers of any complexity.
    

##### ./src/ui_build:
Provides NodeJS API to bundle react applications using configurable abstraction around webpack's config and to retrieve dev middlewares that are used as express middlewares.

##### ./src/server:
ExpressJS static server module with the only method to run the server that accepts:
Server config;
ExoressJS middlewares to use with already predefined;
User's server module that accepts express / node http2 server instance depending from server configuration.
Also includes util to proxy requests to express application.

##### ./src/scripts:
It's the place for essence helper tools:
    init_project: to iinialize ready to use client app
    create_ssl: to generate localhost for dev purposes only https certificates that you can use at least in chrome.

##### ./src/index.js
It's the essence entry point that accepts config as first parameter and run parameters (describing if which is further) as second.

### Installation
```sh
npm i @oswell/essence
```
This package requires some peer dependencies in order to make inner eslint work.
You no need to install peer dependencies if you remove eslint-loader from webpack configuration. See Usage > configuration section

### Usage
If you don't wanna bother yourself with configuration and project structuring - just run at project root level:
```sh
node ./node_modules/@oswell/essence/scripts/init_project.js
```
This script creates production ready project with predefined folder structure including already configured essence to provide the best expirience. Also it creates npm script commands in your package.json (read in apendix section) that cover mostly all the cases you will need during development.

If you just want to try it out without creating entire project anbd configuring the lib. For tis testing purposes essence provides minimal interface:
```js
require('oswell_ui_dev_core')('./app.js')
```
Where ./app.js is entrypoint for your react application. More info read in appendix section.


If you want to build an appication from scratch using this lib then we finally should dive into essence configuring. Next section is right about it.

### Config
### Run parameters
Object that is second parameter to essence entry point. Has the next properties:
isServer - to tell whether to run express static server;
isBuild - to tell whether to build a bundle
isProd - to run build and server in production mode
Defaults are:
```js
{
    isServer: true,
    isBuild: true,
    isProd: false
}
```
##### Apendix
##### TODO