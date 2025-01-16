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
    <img src='https://img.shields.io/badge/node%20v-%3E%3D%2016-brightgreen' alt='node version' />
</a>

<a href=''>
    <img src='https://github.com/cybercookie/siegel/workflows/build/badge.svg' alt='build' />
</a>
</h1>

<br />

#### Siegel is a higly opiniated CSR SPA development platform to build and host any scale projects in a simple way

<br />

Features:
- Preconfigured and easily extendable `Webpack` bundler:
    - `ESBuild` to transform `TypeScript` and `JSX` syntaxes
    - Code linting with `ESLint`
    - `Hot Modules Replace` for **scripts** and **styles**
    - `SASS` with `typed CSS modules`
    - Build and serve site assets compressed with `Brotli` or `GZIP`
    - `SVG icons to font` converter<br /><br />

- `ExpressJS` static server:
    - `HTTP(S)1 / HTTP(S)2`. +Script to create dev certificates to use in Chrome on localhost<br /><br />

- `Utils` and `modules` to use on client side:
    - Big set of `React components`
    - Easy configurable `Router`
    - React `global state manager` built on top of `react hooks`
    - Optional `fetch module` to track requests statuses with
    - `Network` services to make `requests` and minimal client `WebSocket` implementation<br /><br />

- `Demo project` with already themed components, predefined folder structure and scalable architecture built on top of Siegel<br />
    It gives you a quick start right after initialization!

- `Global TS utility types` that you may import. They could be usefull while you are building your React project

<br />

Read more about each part following the links below:
- [Client core](https://github.com/CyberCookie/siegel/tree/master/client_core)
    - [UI](https://github.com/CyberCookie/siegel/tree/master/client_core/ui)
    - [Router](https://github.com/CyberCookie/siegel/tree/master/client_core/router)
    - [Global store](https://github.com/CyberCookie/siegel/tree/master/client_core/store)
    - [Custom hooks](https://github.com/CyberCookie/siegel/tree/master/client_core/hooks)
    - [Network](https://github.com/CyberCookie/siegel/tree/master/client_core/network)
    - [Utils](https://github.com/CyberCookie/siegel/tree/master/client_core/utils)
- Core
    - [Build](https://github.com/CyberCookie/siegel/tree/master/core/client_build)
    - [Server](https://github.com/CyberCookie/siegel/tree/master/core/server)
    - [Utils](https://github.com/CyberCookie/siegel/tree/master/core/utils)
- [Cross env utils](https://github.com/CyberCookie/siegel/tree/master/common)
- [Demo project](https://github.com/CyberCookie/siegel/tree/master/demo_app)
- [TS utils](https://github.com/CyberCookie/siegel/tree/master/global.d.ts)

<br /><br />


## Simple usage

<br />

```sh
npm i siegel
```

<br />

Create **app.ts** file:<br />

```ts
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
createRoot(root)
    .render('Hello Siegel!')
```

<br />

Bootstrap the app with the next command:

```sh
npx siegel run
```

Now your application is hosting on **localhost:3000** in watch mode and ready for development!

<br />

You may also define **NodeJS dev server** using `--server` flag:


```ts
// server.ts

import type { ServerExtenderFn, ExpressExtenderParams } from 'siegel'

const appServer: ServerExtenderFn = params => {
    const { express, staticServer } = params as ExpressExtenderParams

    staticServer
        .use(express.json())
}

export default appServer
```

<br />

To bootstrap the app with server defined - run the next command:

```sh
npx siegel run --server server.ts
```

<br />

Siegel provides a command to initialize mini project along with `server` and `app` files we created above:<br />

```sh
npx siegel init -s
```

<br />

To list all the available Siegel CLI commands and flags: `npx siegel`

<br /><br />


## Usage

<br />

<p>
    Siegel itself it's just a bunch of client / server side modules you may use together or appart.<br />
    To launch Siegel you just import and call it passing<br />
    <a href='#config'>config</a> as a first argument and <a href='#runParams'>runParams</a> as a second
</p><br />


```ts
import siegel from 'siegel'

siegel(config, runParams)
```


<br />

Or just pass an entry point to __react app__ and it will do everything else for you:

```ts
import siegel from 'siegel'

siegel('/path/to/js_entry.ts')
```


<br />

#### <a id='config'>Config</a>

<br />

[Build configuration](https://github.com/CyberCookie/siegel/tree/master/core/client_build)<br />
[Server configuration](https://github.com/CyberCookie/siegel/tree/master/core/server)

```ts
{   
    /*
        Affects both server(as public dir to be served),
        and client_build(as webpack output folder).
        Default is: path.join(process.cwd(), 'dist')
    */
    publicDir: String,

    /* Static server configuration. */
    server: Object,

    /* Build configuration. */
    build: Object
}
```

<br />

#### <a id='runParams'>runParams</a>

<br />

```ts
{   
    /* Run static server. Default is true */
    isServer: Boolean,

    /* Build a project. Default is true */
    isBuild: Boolean,

    /* Run Siegel in production mode. Default is false */
    isProd: Boolean
}
```


<br /><br />

## Demo project init

<br />

Quick way to start your development journey with everything you need right after project initialization is __Demo project__.<br />
You may init the demo project having Siegel installed localy:<br />

```sh
npx siegel init
```

<br /><br />


<!-- <br />

If you've installed Siegel globally then you should run:<br />

```sh
siegel init -g
```

> Keep in mind that Eslint is not working in projects initialized with `-g` flag so far.<br />

<br /><br /> -->

Here we have initialized a demo project in a current dirrectory along with `package.json` (if not yet created)<br />
Now you have project skeleton with preconfigured Siegel in it!<br />
Use various `npm commands` from the new `package.json` to perform build, code validation and static serving in development or production modes<br />
Bootstrap newly created project with:<br />

```sh
npm start
```

<br />

Probably you don't need to initialize a big project to play with code.<br />
For this reason you may init minimal project passing `-m` as argument to the `siegel init` command.<br />
Only client side React entry file and tsconfig will be created.
Optionally you may also pass `-s` parameter to create server extender file.

```sh
npm init -m -s
```

To run mini project use `npm start_client` if created without server extender.<br />
Otherwise use `npm start`


<br />

More about demo project read [here](https://github.com/CyberCookie/siegel/tree/master/demo_app)


<br /><br />

### VSCode tweaks

<p>
    In order to enable all the features, Siegel provides, you should first change some settings in your VSCode:<br />

```json
{
    "typescript.tsdk": "./node_modules/typescript/lib",
    "eslint.useFlatConfig": true
}
```
`typescript.tsdk` - to tell TS extension to load ts plugins from your `tsconfig.json`<br />

`eslint.useFlatConfig` - to tell ESLint to use `.js` config file extension by default
</p>


<br /><br />

### Siegel development

<br />

In case you've cloned this repo:

<br />

To build `siegel` run:

```sh
npm run __transpile
```

To start a local development with provided `Demo Application` run:

```sh
npm start
```