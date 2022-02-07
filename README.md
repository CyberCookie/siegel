<br />
<h1>
    siegel&nbsp;&nbsp;&nbsp;

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


<h4>
    Siegel is a higly opiniated SPA development platform to build and host any scale projects in a simple way.
    <br />
</h4>
<br />

The platform provides:<br/>

<ul>
    <li>
        Preconfigured and easily extendable <code>Webpack</code> bundler:
        <ul>
            <li><code>ESBuild</code> to transform <code>TypeScript</code> and <code>JSX</code> syntaxes.</li>
            <li>Code linting with <code>ESLint</code>.</li>
            <li><code>Hot Modules Replace</code> for <b>scripts</b> and <b>styles</b></li>
            <li><code>SASS</code> with <code>CSS modules</code>.</li>
            <li>Compress and serve site assets compressed with <code>Brotli</code> or <code>GZIP</code>.</li>
            <li><code>SVG icons to font</code> converter.</li>
        </ul>
    </li><br />
    <li>
        <code>ExpressJS</code> static server:
        <ul>
            <li><code>HTTP(S)1 / HTTP(S)2</code>. +Script that creates dev certificates to use in Chrome on localhost.</li>
            <li><code>PM2</code> deamon to wrap your application in production mode.</li>
        </ul>
    </li><br />
    <li>
        Utils and modules to use on client side:
        <ul>
            <li>Big set of <code>React components</code>.</li>
            <li>React <code>global state manager</code> built on top of <code>react hooks</code> and optional fetch module to track requests with.</li>
            <li>Recursively configurable <code>react router</code> wrapper.</li>
            <li>Network services to make requests and minimal client WebSocket implementation.</li>
        </ul>
    </li><br />
    <li>
        <code>Demo project</code> with themed components, predefined folder structure and scalable architecture built on top of Siegel.<br />
        It gives you a quick start right after initialization!
    </li>
</ul>


Read more about each part following the links below:
- [Client core](https://github.com/CyberCookie/siegel/tree/master/client_core)
    - [UI](https://github.com/CyberCookie/siegel/tree/master/client_core/ui)
    - [Router](https://github.com/CyberCookie/siegel/tree/master/client_core/router)
    - [Global store](https://github.com/CyberCookie/siegel/tree/master/client_core/store)
    - [Custom hooks](https://github.com/CyberCookie/siegel/tree/master/client_core/hooks)
    - [Network](https://github.com/CyberCookie/siegel/tree/master/client_core/network)
    - [Utils](https://github.com/CyberCookie/siegel/tree/master/client_core/utils)
- [Build](https://github.com/CyberCookie/siegel/tree/master/src/client_build)
- [Server](https://github.com/CyberCookie/siegel/tree/master/src/server)
- [Utils](https://github.com/CyberCookie/siegel/tree/master/src/utils)
- [Demo project](https://github.com/CyberCookie/siegel/tree/master/demo_app)

<br /><br />
<h2>Simple usage</h2><hr /><br />

```sh
npm i siegel
```

<br />
Create <b>app.ts</b> file:<br /><br />

```ts
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

Now your application is hosting on <b>localhost:3000</b> in watch mode and ready for development!<br /><br />


You may also define <b>NodeJS dev server</b> with `--server` flag:<br />

create <b>server.js</b>

```js
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
To get more info about siegel CLI commands run:<br />

```sh
npx siegel
```

<br />
<br />



<br /><br />
<h2>Usage</h2><hr /><br />

<p>
    Appart from calling siegel from CLI you may also use it in the most straightforward and flexible way - as a NodeJS module!<br />
    Siegel itself is a function that accepts <b><a href='#config'>config</a></b> as a first argument and <b><a href='#runParams'>runParams</a></b> as a second.<br />
    You may read about these parameters further.
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
<h4>
    <a id='config'>Config</a>
</h4>
<br />

[->> Build configuration](https://github.com/CyberCookie/siegel/tree/master/src/client_build)<br />
[->> Server configuration](https://github.com/CyberCookie/siegel/tree/master/src/server)

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
<h4>
    <a id='runParams'>runParams</a>
</h4>
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
<h2>Demo project init</h2><hr /><br />

Initialization of demo project it's a quick way to start your project with everything you need right out of the box.<br />
There are two module resolution strategies that you may choose.<br /><br >

We already seen the first one, where we had siegel installed locally and were able to initialize project with `npx siegel init`<br />

```sh
    npm i siegel

    npx siegel init
```

<br /><br />

The second one is to have siegel installed globally and to use its node modules therefore to have a <b>single source of node modules for all your siegel proejcts</b>.<br />

```sh
npm i -g siegel

siegel init -g
```

> Eslint is not working in projects initialized with `-g` flag.<br />


<br /><br />
Here we initialize a demo project in a current dirrectory along with a package.json (if not yet exists).<br />
Now you have project skeleton with preconfigured siegel in it!<br />
Use various `npm commands` from the new `package.json` to perform build, code validation and static serving in development or production mode.<br />
Now you may start a newly created project with: <br />

```sh
npm start
```


<br />

More about demo project read [here](https://github.com/CyberCookie/siegel/tree/master/demo_app).<br />


<br /><br />
<h3>Siegel development</h3><hr /><br />

In case you've cloned this repo:<br />

To build `client_core` run:

```sh
node prepublish.js
```


To start a local development with `demo_app` run:

```sh
npm start
```