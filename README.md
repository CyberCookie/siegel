# Essence

### Description
Finally*! The package you been waiting for long is already here to abstract all the boring routines you've been doing submissively on every project. Now nothing can stop you from diving into a business logic right after installation.\
.* - the project is workable but still in alpha phase. Some configurations may change in future. Docs are not well written so far.

In general this package is a site development platform that consists of three main parts (UI, build, server) that you can use individually or in conjuction with other parts:
- [ui_core](./src/ui_core/README.md)
- [ui_build](./src/ui_build/README.md)
- [server](./src/server/README.md)

And two helper parts (scripts, demo project):
- [scripts](./src/scripts/README.md)
- [demo project](./__example/README.md)


### Installation
```sh
npm i @oswell/essence
```
You should install some peer dependencies in order to make inner eslint and typescript proper validate your code. There is an __install_peers.js__ script located in scripts part that can make it easier for you.

### Usage
Essence is a function that accepts __config__ as a first argument and __runParams__ as a second.
You may read about these parameters below.
```js
require('essence')(config, runParams)
```
Essence supports minimal config for testing purposes where only react application entrypoint is required:
```js
require('essence')('./app.js')
```

If you don't want to bother yourself with project creating and essence configuring - you can just run from root level helper script that creates it all for you:
```sh
node ./node_modules/essence/src/scripts/init_project.js
```
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

__server.extenderLoc__ - path to a user defined server to extend the one created by essence. Server extender should be a function. Function receives instance of server as a first paramenter and dependencies used for creating this server as a second.\
__server.watch__ - reload when some changes in user server occur.\
__server.host__ - host used in static server.\
__server.port__ - port used in static server.\
__server.http2__ - whether to use HTTP2 protocol.\
__server.ssl.keyPath__ - path to a ssl private key.\
__server.ssl.certPath__ - path to a signed certificate.\

__build.input.js__ - path to a react application entrypoint.\
__build.input.sw__ - path to a service worker.\
__build.input.html__ - path to a site entrypoint.\
__build.input.assetsDir__ - path to an application static assets folder.\
__build.input.sassResources__ - path to a styles files which will be included in every other styles file. (Because of CSS modules).\
__build.output__ - path to a folder when output code will be stored.\
__build.aliases__ - webpack compatible aliases.\
__build.plugins__ - used to extend essence webpack plugins or to add your own. There are 8 plugins that are used during the build: compression, copy, sw, cssExtract, html, hot, clean and reactRefresh. Each of them you may disable or extend with your own options that will be merged with existing ones. Some plugins like compression may have several instances (one for brotli and another one for gzip). In this example described how plugins could be configured:
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

__build.postProcessWebpackConfig__ - function that receives full webpack config that you can postprocess giving you full controll over the build.

##### runParams

```js
{
    isServer: Boolean, // run static server. Default true
    isBuild: Boolean,  // process your source code and put result into output folder. Default true
    isProd: Boolean    // run static server and / or build in production mode. Default false
}
```

##### TODO