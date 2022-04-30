<br />
<h1>
    Siegel&nbsp;&nbsp;&nbsp;

<a href='https://badge.fury.io/js/siegel' target='_blank'>
    <img src='https://badge.fury.io/js/siegel.svg' alt='npm package version' />
</a>

<a href=''>
    <img src='https://img.shields.io/badge/npm%20v-%3E%3D%207-brightgreen' alt='npm version' />
</a>

<a href=''>
    <img src='https://img.shields.io/badge/node%20v-%3E%3D%2014-brightgreen' alt='npm version' />
</a>

<a href=''>
    <img src='https://github.com/cybercookie/siegel/workflows/build/badge.svg' alt='build' />
</a>
</h1>

<br />

#### Siegel is a higly opiniated SPA development platform to build and host any scale projects in a simple way.

<br />

Features:
- Preconfigured and easily extendable `Webpack` bundler:
    - `ESBuild` to transform `TypeScript` and `JSX` syntaxes
    - Code linting with `ESLint`
    - `Hot Modules Replace` for **scripts** and **styles**
    - `SASS` with `CSS modules`
    - Compress and serve site assets compressed with `Brotli` or `GZIP`
    - `SVG icons to font` converter<br /><br />

- `ExpressJS` static server:
    - `HTTP(S)1 / HTTP(S)2`. +Script that creates dev certificates to use in Chrome on localhost
    - `PM2` deamon to wrap your application in production mode<br /><br />

- `Utils` and `modules` to use on client side:
    - Big set of `React components`
    - React `global state manager` built on top of `react hooks` and optional fetch module to track requests with
    - Easy configurable `Router`
    - `Network` services to make requests and minimal client WebSocket implementation<br /><br />

- `Demo project` with themed components, predefined folder structure and scalable architecture built on top of Siegel<br />
    It gives you a quick start right after initialization!

<br />

Read more about each part following the links below:
- [Client core](https://github.com/CyberCookie/siegel/tree/master/client_core)
    - [UI](https://github.com/CyberCookie/siegel/tree/master/client_core/ui)
    - [Router](https://github.com/CyberCookie/siegel/tree/master/client_core/Router)
    - [Global store](https://github.com/CyberCookie/siegel/tree/master/client_core/store)
    - [Custom hooks](https://github.com/CyberCookie/siegel/tree/master/client_core/hooks)
    - [Network](https://github.com/CyberCookie/siegel/tree/master/client_core/network)
    - [Utils](https://github.com/CyberCookie/siegel/tree/master/client_core/utils)
- [Build](https://github.com/CyberCookie/siegel/tree/master/src/client_build)
- [Server](https://github.com/CyberCookie/siegel/tree/master/src/server)
- [Utils](https://github.com/CyberCookie/siegel/tree/master/src/utils)
- [Demo project](https://github.com/CyberCookie/siegel/tree/master/demo_app)

<br /><br />

## Simple usage

<hr /><br />

```sh
npm i siegel
```

<br />

Create **app.ts** file:<br /><br />

```js
import { render } from 'react-dom'

render(
    'Hello Siegel!',
    document.getElementById('root')
)

module.hot?.accept() // Webpack's hmr bug workaround
```


<br />
Bootstrap the app with the next command:<br />

```sh
npx siegel run
```

Now your application is hosting on **localhost:3000** in watch mode and ready for development!<br /><br />


You may also define **NodeJS dev server** with `--server` flag:<br />

```js
// server.js

function appServer(app, { express }) {
    console.log('Custom server is ready')
}

module.exports = appServer
```

In console run:<br />

```sh
npx siegel run --server server.js 
```


<br />
To get more info about Siegel CLI commands run:<br />

```sh
npx siegel
```

<br /><br />

## Usage

<hr /><br />

<p>
    Appart from calling Siegel from CLI you may also use it in the most straightforward and flexible way - as a NodeJS module!<br />
    Siegel itself is a function that accepts <a href='#config'>config</a> as a first argument and <a href='#runParams'>runParams</a> as a second<br />
    You may read about these parameters further
</p>


```js
import siegel from 'siegel'

siegel(config, runParams)
```


<br />
There is another signature when you only specify absolute path to js entry file:<br />

```js
import siegel from 'siegel'

siegel('/path/to/js_entry.ts')
```


<br />

#### <a id='config'>Config</a>

<br />

[Build configuration](https://github.com/CyberCookie/siegel/tree/master/src/client_build)<br />
[Server configuration](https://github.com/CyberCookie/siegel/tree/master/src/server)

```js
{   
    /*
        Affects both server(as public dir to be served),
        and client_build(as webpack output folder).
        Default is: path.join(process.cwd(), 'dist')
    */
    staticDir: String,

    /* Static server configuration. */
    server: Object,

    /* Build configuration. */
    build: Object
}
```

<br />

#### <a id='runParams'>runParams</a>

<br />

```js
{   
    /* Run static server. Default is true */
    isServer: Boolean,

    /* Build a project. Default is true */
    isBuild: Boolean,

    /* Run siegel in production mode. Default is false */
    isProd: Boolean
}
```


<br /><br />

## Demo project init

<hr /><br />

Demo project it's a quick way to start your development journey with everything you need right after project initialization.<br />
There are two module resolution strategies that you may choose<br /><br >

Having Siegel installed localy, run:<br />

`npx siegel init`<br /><br />


<br />

The second one is to have Siegel installed globally and to use its node modules therefore to have a **single source of node modules for all your Siegel proejcts**<br />

```sh
siegel init -g
```

> Keep in mind that Eslint is not working in projects initialized with `-g` flag<br />


<br /><br />
Here we initialize a demo project in a current dirrectory along with `package.json` (if not yet exists)<br />
Now you have project skeleton with preconfigured Siegel in it!<br />
Use various `npm commands` from the new `package.json` to perform build, code validation and static serving in development or production mode<br />
Bootstrap newly created project with:<br />

```sh
npm start
```


<br />

More about demo project read [here](https://github.com/CyberCookie/siegel/tree/master/demo_app)<br />


<br /><br />

### Siegel development

<hr /><br />

In case you've cloned this repo:<br />

To build `client_core` run:

```sh
node prepublish.js
```


To start a local development with `demo_app` run:

```sh
npm start
```