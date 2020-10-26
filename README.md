<div>
    <a href='https://expressjs.com'>
        <img height='30' src='https://intuz-site.imgix.net/uploads/express.svg' alt='expressJS' />
    </a>
    <a href='https://pm2.io'>
        <img height='40' src='https://pm2.keymetrics.io/assets/pm2-logo-1.png' alt='pm2' />
    </a>
    <br />
    <a href='https://github.com/webpack/webpack'>
        <img height='50' src='https://webpack.js.org/assets/icon-square-big.svg' alt='webpack'>
    </a>
    <a href='https://github.com/eslint/eslint'>
        <img height='50' src='https://cdn.worldvectorlogo.com/logos/eslint.svg' alt='eslint'>
    </a>
    <a href='https://github.com/babel/babel'>
        <img height='50' src='https://rawgit.com/babel/logo/master/babel.svg' alt='babel'>
    </a>
    <a href='https://www.typescriptlang.org/'>
        <img height='50' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png' alt='typescript'>
    </a>
    <a href='https://sass-lang.com/'>
        <img height='50' src='https://worldvectorlogo.com/logos/sass-1.svg' alt='sass'>
    </a>
    <br />
    <a href='https://reactjs.org'>
        <img height='50' src='https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' alt='react' />
    </a>
    <a href='https://redux.js.org'>
        <img height='50' src='https://redux.js.org/img/redux.svg' alt='redux' />
    </a>
    <a href='https://reactrouter.com' />
        <img height='40' src='https://seeklogo.com/images/R/react-router-logo-AB5BFB638F-seeklogo.com.png' alt='react-router' />
    </a>
</div>
<br />
<a href='https://badge.fury.io/js/siegel'>
    <img src='https://badge.fury.io/js/siegel.svg' alt='npm version' />
</a>

<a href='https://david-dm.org/cybercookie/siegel'>
    <img src='https://david-dm.org/cybercookie/siegel.svg' alt='Dependency Status' />
</a>

<a>
    <img src='https://github.com/cybercookie/siegel/workflows/build/badge.svg' alt='build' />
</a>

<br /><br />
<h1>siegel</h1>


<h3>Description</h3>
<p>
    Finally*! The package you been waiting for long is already here to abstract all the boring routines you've been doing submissively on every project. Now nothing can stop you from diving into a business logic right after installation.
</p>
<br /><h6>
    * the project is workable but still in alpha phase. Some configurations may change in future. Docs are not well written so far.
</h6><br />

In general this package is a site development platform that consists of three main parts (UI, build, server) that you can use individually or in conjuction with other parts:
- [ui_core](https://github.com/CyberCookie/siegel/tree/master/src/ui_core) - Front-end related code. It's the only part you will be using directrly.
- [ui_build](https://github.com/CyberCookie/siegel/tree/master/src/ui_build) - webpack build lives here.
- [server](https://github.com/CyberCookie/siegel/tree/master/src/server) - static server is here.

And two helper parts (scripts, demo project):
- [scripts](https://github.com/CyberCookie/siegel/tree/master/src/scripts) - siegel helper scripts.
- [demo project](https://github.com/CyberCookie/siegel/tree/master/demo_app) - for inner tests and project installation.


<br />
<h3>Installation</h3><hr />

```sh
npm i siegel
```

<p>
    You should install some peer dependencies in order to make inner eslint and typescript proper validate your code.<br />
    There is an <b>install_peers.js</b> script located in scripts part that can make it easier for you.
</p>


<br />
<h3>Usage</h3><hr />
<p>
    Siegel exports function that accepts <b>config</b> as a first argument and <b>runParams</b> as a second.<br />
    You may read about these parameters below.
</p>

```js
require('siegel')(config, runParams)
```

<br />
<p>
    Siegel supports zero configuration mode to make it super easy for you to try it.<br />
    Create app.ts file somewhere in your project:
</p>
<h5>app.ts</h5>

```ts
import { render } from 'react-dom'

render(
    'hello world',
    document.getElementById('root')
)
```

<p>
    Create simple index.js node file:
</p>
<h5>index.js</h5>

```js
require('siegel')(/*relative path to js entrypoint. Default is ./app.ts*/)
```

<p>
    And execute it via CLI:
</p>

```sh
node index.js
```

<p>
    <b>app.ts</b> file will be proccessed through inner webpack and hosted with inner express static server,<br />
    so you can open localhost:3000 in your browser and observe the result!
</p>



<br />
<p>
    If you don't want to bother yourself with a project creating and siegel configuring - just run from a project root level script that will create it all for you:
</p>

```sh
node ./node_modules/siegel/src/scripts/init_project.js --run --peers
```

Client and server folders with its scripts will be created along with configurable typescript and eslint config.

(You may read about script params in)[scripts section](https://github.com/CyberCookie/siegel/tree/master/src/scripts).


<br />
<h4>Config</h4>

```js
{   
    /*
        Affects both server(as public dir to be served),
        and ui_build(as webpack output folder).
        Default is: path.join(process.cwd(), 'dist')
    */
    staticDir: String,

    /*
        Static server configuration.
        Read more in 'server' section
    */
    server: Object,

    /*
        Build configuration.
        Read more in 'ui_build' section
    */
    build: Object
}
```


<h4>runParams</h4>

```js
{
    isServer: Boolean, // run static server. Default true
    isBuild: Boolean,  // process your source code and put result into output folder. Default true
    isProd: Boolean    // run static server and / or build in production mode. Default false
}
```
