# siegel

### Description
Finally*! The package you been waiting for long is already here to abstract all the boring routines you've been doing submissively on every project. Now nothing can stop you from diving into a business logic right after installation.\
.* - the project is workable but still in alpha phase. Some configurations may change in future. Docs are not well written so far.

In general this package is a site development platform that consists of three main parts (UI, build, server) that you can use individually or in conjuction with other parts:
- [ui_core](https://github.com/CyberCookie/siegel/tree/master/src/ui_core) - Front-end related code. It's the only part you will be using directrly.
- [ui_build](https://github.com/CyberCookie/siegel/tree/master/src/ui_build) - webpack build lives here.
- [server](https://github.com/CyberCookie/siegel/tree/master/src/server) - static server is here.

And two helper parts (scripts, demo project):
- [scripts](https://github.com/CyberCookie/siegel/tree/master/src/scripts) - siegel helper scripts.
- [demo project](https://github.com/CyberCookie/siegel/tree/master/__example) - for inner tests and project installation.


### Installation
```sh
npm i siegel
```
You should install some peer dependencies in order to make inner eslint and typescript proper validate your code. There is an __install_peers.js__ script located in scripts part that can make it easier for you.

### Usage
siegel is a function that accepts __config__ as a first argument and __runParams__ as a second.
You may read about these parameters below.
```js
require('siegel')(config, runParams)
```
siegel supports minimal config for testing purposes where only react application entrypoint is required:
```js
require('siegel')('./app.js')
```

If you don't want to bother yourself with project creating and siegel configuring - you can just run from root level helper script that creates it all for you:
```sh
node ./node_modules/siegel/src/scripts/init_project.js --run --peers
```
You may readt about script params in [scripts section](https://github.com/CyberCookie/siegel/tree/master/src/scripts).
##### Config
Defaults are commented.
```js
{
    server: {
        extenderLoc: String,
        watch: Boolean,
        host: String,       // 'localhost'
        port: Number,       // 3000
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
##### server
- __extenderLoc__ - path to a user defined server to extend the one created by siegel. Server extender should be a function. Function receives instance of server as a first paramenter and dependencies used for creating this server as a second.\
- __watch__ - reload when some changes in user server occur.\
- __host__ - host used in static server.\
- __port__ - port used in static server.\
- __http2__ - whether to use HTTP2 protocol.\
- __ssl.keyPath__ - path to a ssl private key.\
- __ssl.certPath__ - path to a signed certificate.\

##### build
__input.js__ - path to a react application entrypoint.\
__input.sw__ - path to a service worker.\
__input.html__ - path to a site entrypoint.\
__input.assetsDir__ - path to an application static assets folder.\
__input.sassResources__ - path to a styles files which will be included in every other styles file. (Because of CSS modules).\
__output__ - path to a folder when output code will be stored.\
__aliases__ - webpack compatible aliases.\
__plugins__ - used to extend siegel webpack plugins or to add your own. There are 8 plugins that are used during the build: compression, copy, sw, cssExtract, html, hot, clean and reactRefresh. Each of them you may disable or extend with your own options that will be merged with existing ones. Some plugins like compression may have several instances (one for brotli and another one for gzip). In this example described how plugins could be configured:
```js
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
```

__postProcessWebpackConfig__ - function that receives full webpack config that you can postprocess giving you full controll over the build.

##### runParams

```js
{
    isServer: Boolean, // run static server. Default true
    isBuild: Boolean,  // process your source code and put result into output folder. Default true
    isProd: Boolean    // run static server and / or build in production mode. Default false
}
```

##### TODO