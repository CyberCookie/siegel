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

#### Siegel is a lightweight, opinionated web development platform designed for building scalable client side rendered (CSR) single page applications (SPAs). It aims to simplify the development process.

<br />

Features:
- Pre-configured and easily extendable `Webpack` bundler:
    - `SWC loader` to transform `TypeScript` and `JSX` syntaxes
    - Code linting with `ESLint`
    - `Hot Modules Replace` for **scripts** and **styles**
    - `SASS` with `typed CSS modules`
    - Build and serve site assets compressed with `Brotli` or `GZIP`
    - `SVG icons to font` converter<br /><br />

- `ExpressJS` static server:
    - Supports `HTTP/1.1` and `HTTP/2`, with a script for generating development certificates for local Chrome use<br /><br />

- `Utils` and `modules` to use on client side:
    - A comprehensive set of `React components`
    - Easy configurable `Router`
    - React `global state manager` built on top of `react hooks`
    - Optional `fetch module` for tracking requests statuses
    - `Network` services for making `requests` and a minimal client `WebSocket` implementation<br /><br />

- `Demo project` with pre-themed components, a predefined folder structure, and a scalable architecture built on Siegel<br />
    This facilitates a rapid project start after initialization

- `Global TS utility types` are available, enchancing development of your React project 

<br />

Read more about each part following the links below:
- Client core
    - [UI components](https://github.com/CyberCookie/siegel/tree/master/client_core/ui) - Common and lightweight React UI components
    - [Routing](https://github.com/CyberCookie/siegel/tree/master/client_core/router) - Built-in routing system, simplifying navigation within your SPA and enabling efficient page management
    - [Global store](https://github.com/CyberCookie/siegel/tree/master/client_core/store) - Allows you to easily create and manage global stores built on top of React hooks
    - [Custom hooks](https://github.com/CyberCookie/siegel/tree/master/client_core/hooks) - A selction of React to aid in site creation
    - [Networking](https://github.com/CyberCookie/siegel/tree/master/client_core/network) - Tools for a network data transmission 
    - [Utils](https://github.com/CyberCookie/siegel/tree/master/client_core/utils) - Web related small utilities
- Core
    - [Build](https://github.com/CyberCookie/siegel/tree/master/core/client_build) - Webpack abstraction to easily configure a build process
    - [Server](https://github.com/CyberCookie/siegel/tree/master/core/server) - Minimalistic HTTP1.1(S) / HTTP2(S) servers built with ExpressJS 
    - [Utils](https://github.com/CyberCookie/siegel/tree/master/core/utils) - NodeJS related utils
- [Cross env utils](https://github.com/CyberCookie/siegel/tree/master/common) - Basic utils to help you process data
- [Demo project](https://github.com/CyberCookie/siegel/tree/master/demo_app) - Examle project demonstrating Siegel abilities
- [TS utils](https://github.com/CyberCookie/siegel/tree/master/global.d.ts) - Useful TypeScript generics

<br /><br />


## Getting started

<br />

Install Siegel as a project dependency with npm:

```sh
npm i siegel
```

<br />

Create a new file named **app.ts** in your project root directory and add the following code:<br />

```ts
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
createRoot(root)
    .render('Hello Siegel!')
```

<br />

Run the app with the next command:

```sh
npx siegel run
```

Your app will now be running on **localhost:3000** in watch mode, enabling live development.

<br />

Additionaly, uou can define a custom **NodeJS development server** using the `--server` flag.<br/>
Create a **server.ts** file with the following content:


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

To start the app with the custom server, execute the following command:

```sh
npx siegel run --server server.ts
```

<br />

Siegel provides a command to initialize a minimal project, including the **server.ts** and **app.ts** files created earlier:<br />

```sh
npx siegel init -s
```

<br />

To view a list of all available Siegel CLI commands and flags, run: `npx siegel`

<br /><br />


## Basic usage

<br />

<p>
    Siegel is composed of client sude and server side modules that can be used independently or in combination.<br />
    To launch Siegel, import the module and call it with a <br />
    <a href='#config'>config object</a>
</p><br />


```ts
import siegel from 'siegel'

siegel(config)
```


<br />

Alternatively, you can provide the entry point to your __React application__ and Siegel will handle the remaining configs:

```ts
import siegel from 'siegel'

siegel('/path/to/js_entry.ts')
```


<br />

#### <a id='config'>Config</a>

<br />

[Build config](https://github.com/CyberCookie/siegel/tree/master/core/client_build) <br />
[Server config](https://github.com/CyberCookie/siegel/tree/master/core/server)

```ts
{   
    runMode: {
        /* Run static server. Default is true */
        isServer: Boolean,

        /* Build a project. Default is true */
        isBuild: Boolean,

        /* Run Siegel in production mode. Default is false */
        isProd: Boolean
    },

    /*
        Affects both server(as public dir to be served),
        and client_build(as webpack output folder).
        Default is: path.join(process.cwd(), 'dist')
    */
    publicDir: String,

    /* Static server config. */
    server: Object,

    /* Build config. */
    build: Object
}
```


<br /><br />

## Demo project setup

<br />

The demo project provides a quick start for your development journey, offering all necessary components immediately after initialization.<br />

Install Siegel as a project dependency with npm:<br />

```sh
npx siegel init
```

<br />


<!-- <br />

If you've installed Siegel globally then you should run:<br />

```sh
siegel init -g
```

> Keep in mind that Eslint is not working in projects initialized with `-g` flag so far.<br />

<br /><br /> -->

This comman initializes a demo project in the current directory, including a `package.json` if not one does not already exist.<br />
The project now has pre-configured Siegel project structure.<br />
Use the various `npm commands` within the generated `package.json` to build, validate and server the project in development or production modes.<br />
Start the newly created project with:<br />

```sh
npm start
```

<br />

For quick experimentation, you may not need to initialize a full demo project.<br />
Therefore, you can initialize a minimal project by passing the `-m` flag to the `siegel init` command.<br />
This creates only a client-side React entry file and a `tsconfig.json` file.<br />
Optionally you can also pass the `-s` flag to create a server extender file.

```sh
npm init -m -s
```

To run the minimal project, use `npm start_client` if a server extender was not created.<br />
Otherwise use `npm start`


<br />

Read more about demo project [here](https://github.com/CyberCookie/siegel/tree/master/demo_app)


<br /><br />

### VSCode tweaks

<p>
    In order to enable all the features that Siegel provides, you should first change some settings in your VSCode:<br />

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