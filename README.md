# Essence

### Description
Finally*! The package you been waiting for long is already here to abstract all the boring routines you've been doing submissively on every project.
Now nothing can stop you from diving into a business logic right after installation.

.* - the project is workable but still in alpha phase. Some configurations may change in future. Docs are not well written so far.

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
```js
const essence = require('essence')

essence(config, runParams)
```
Essence supports minimal config for testing purposes where only react application entrypoint is required,
```js
require('essence')('./app.js')
```
##### Config
Defaults are commented

```js
{
    server: {
        extenderLoc: String,    // 'localhost'
        watch: Boolean,         // 3000
        host: String,
        port: Number,
        http2: Boolean,
        ssl: {
             keyPath: String,
             certPath: String
        }
    },

    build: {
        input: {
            js: String,
            sw: String,
            html: String,
            assetsDir: String,
            sassResources: String
        },
        output: String,         // if entrypoint located at root level - 'dist' folder will be created at the same level. Othervice 'dist' folder will be created one level upper regarding to an entrypoint.
        aliases: Object,

        plugins: Object,

        postProcessWebpackConfig: Function
    }
}
```

server.extenderLoc - path to user defined server to extend the one created by essence. Server extender should be a function. Function receives instance of server as first paramenter and dependencies used for creating this server as second.
server.watch - reload when some changes in user server occur.
server.host - host used in static server.
server.port - port used in static server.
server.http2 - whether to use HTTP2 protocol.
server.ssl.keyPath - path to a ssl private key.
server.ssl.certPath - path to a signed certificate.

build.input.js - path to a react application entrypoint.
build.input.sw - path to a service worker.
build.input.html - path to a site antrypoint.
build.input.assetsDir - path to an application static assets folder.
build.input.sassResources - path to a styles files which will be included in every other styles file. (Because of CSS modules).
build.output - path to a folder when output code will be stored.
build.aliases - webpack compatible aliases.
build.plugins - used to extend essence webpack plugins or to add your own. There are 8 plugins that are used during the build: compression, copy, sw, cssExtract, html, hot, clean and reactRefresh. Each of them you may disable or extend with your own options that will be merged with existing ones. Some plugins like compression may have several instances (one for brotli and another one for gzip). In this example described how plugins could be configured:
```js
{
    build: {
        plugins: {
            compression: {
                instances: {
                    br: {
                        options: { /* plugin instance options */ }
                    },
                    gzip: false // to disable the plugin instance
                }
            },
            sw: false, // to disable the plugin
            html: {
                options: { /* plugin options */ }
            }
        }
    }
}
```

build.postProcessWebpackConfig - function that receives full webpack config that you can postprocess giving you full controll over the build.

##### Run parameters
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

##### TODO