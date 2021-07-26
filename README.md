[comment]: # (TODO: Fetch module last error)
[comment]: # (TODO: Component refApi)
[comment]: # (TODO: server proxy)
[comment]: # (TODO: router children updater)
[comment]: # (TODO: module regexp rewrite)

<br />
<h1>
    siegel&nbsp;&nbsp;&nbsp;

<a href='https://badge.fury.io/js/siegel' target='_blank'>
    <img src='https://badge.fury.io/js/siegel.svg' alt='npm version' />
</a>

<a href='https://david-dm.org/cybercookie/siegel' target='_blank'>
    <img src='https://david-dm.org/cybercookie/siegel.svg' alt='Dependency Status' />
</a>

<a href="">
    <img src='https://github.com/cybercookie/siegel/workflows/build/badge.svg' alt='build' />
</a>
</h1>


<h4>
    Siegel is a higly opiniated SPA development platform that helps you to build and host your projects of any scale in a simple way.
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
            <li><code>Hot Modules Replace</code> for <b>js</b>, <b>jsx</b> and <b>styles</b></li>
            <li><code>SASS</code> with <code>CSS modules</code> approach.</li>
            <li>Build into <code>Brotli</code> and <code>GZIP</code> compression formats.</li>
            <li><code>SVG icons to font</code> converter.</li>
        </ul>
    </li>
    <li>
        <code>ExpressJS</code> static server:
        <ul>
            <li><code>HTTP(S)1 / HTTP(S)2</code>. +Script for creating dev certificates to use on localhost in Chrome.</li>
            <li><code>PM2</code> deamon to wrap your application in production.</li>
            <li><code>Live Reload</code> for <b>NodeJS</b> code.</li>
        </ul>
    </li>
    <li>
        Utils and modules to use on client side:
        <ul>
            <li>Big set of <code>React components</code>.</li>
            <li>React <code>global state managers</code> built with <code>hooks</code> or <code>Redux</code> with fetch module to track requests with.</li>
            <li>Recursively configurable <code>react router</code> wrapper.</li>
            <li><code>Request</code> service.</li>
        </ul>
    </li>
    <li>
        <code>Demo project</code> with themed components, predefined folder structure and scalable architecture built on top of Siegel.<br />
        It gives you a quick start right after initialization!
    </li>
</ul>


Read more about each part following the links below:
- [UI](https://github.com/CyberCookie/siegel/tree/master/client_core)
- [Build](https://github.com/CyberCookie/siegel/tree/master/src/client_build)
- [Server](https://github.com/CyberCookie/siegel/tree/master/src/server)
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


```sh
npx siegel run -b -s -js ./app.ts
```


You've just built (`-b`) the <b>app.ts</b> file and now it is serving (`-s`) on <b>localhost:3000</b> in watch mode.<br />
<b>Enjoy your development!</b>
<br /><br />

> You are also capable to perform this actions with global siegel installation

<br />
To print siegel's CLI info run:

```sh
npx siegel
```


<br /><br />
<h2>Usage</h2><hr /><br />

<p>
    Appart from calling siegel from CLI you may also use it in the most straightforward and flexible way - as a NodeJS module!<br />
    Siegel itself is a function that accepts <b><a href='#config'>config</a></b> as a first argument and <b><a href='#runParams'>runParams</a></b> as a second.<br />
    You may read about these parameters below.
</p>


```js
require('siegel')(config, runParams)
```


<br />
There is another signature when you only specify absolute path to js entry file:<br />

```js
require('siegel')('/path/to/js_entry.js')
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

```sh
siegel init
```

Here we initialize a demo project in a current dirrectory along with a package.json (if not yet exists).<br />
Now you have project skeleton with preconfigured siegel in it!<br />
Use various `npm commands` from the new `package.json` to perform build, code validation and static serving in development or production mode. For example:<br />

```sh
npm start
```

<br />
It's possible to initialize a demo project having siegel installed globally. In this case you need to pass <code>-g</code> paremeter to init script

```sh
siegel init -g
```

but it's tricky since we need to define path to global node modules in <b>tsconfig.json</b> and <b>.eslintrc</b>.<br />
This path may vary on different machines.


More about demo project read [here](https://github.com/CyberCookie/siegel/tree/master/demo_app).<br />


<br /><br />
<h3>Siegel development</h3><hr /><br />

in case of you've cloned this repo:<br />

Build `/src`

```sh
npm run build_node
```

Develop using `demo_app` with

```sh
npm start
```