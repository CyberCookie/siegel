<div>
    <a href='https://expressjs.com' target='_blank'>
        <img height='30' src='https://intuz-site.imgix.net/uploads/express.svg' alt='expressJS' />
    </a>
    <a href='https://pm2.io' target='_blank'>
        <img height='40' src='https://raw.githubusercontent.com/Unitech/pm2/development/pres/pm2-v4.png' alt='pm2' />
    </a>
    <br />
    <a href='https://webpack.js.org' target='_blank'>
        <img height='50' src='https://webpack.js.org/assets/icon-square-big.svg' alt='webpack'>
    </a>
    <a href='https://eslint.org' target='_blank'>
        <img height='50' src='https://cdn.worldvectorlogo.com/logos/eslint.svg' alt='eslint'>
    </a>
    <a href='https://babeljs.io' target='_blank'>
        <img height='50' src='https://rawgit.com/babel/logo/master/babel.svg' alt='babel'>
    </a>
    <a href='https://www.typescriptlang.org' target='_blank'>
        <img height='50' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png' alt='typescript'>
    </a>
    <a href='https://sass-lang.com' target='_blank'>
        <img height='50' src='https://worldvectorlogo.com/logos/sass-1.svg' alt='sass'>
    </a>
    <br />
    <a href='https://reactjs.org' target='_blank'>
        <img height='50' src='https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' alt='react' />
    </a>
    <a href='https://redux.js.org' target='_blank'>
        <img height='50' src='https://redux.js.org/img/redux.svg' alt='redux' />
    </a>
    <a href='https://reactrouter.com' target='_blank'>
        <img height='40' src='https://seeklogo.com/images/R/react-router-logo-AB5BFB638F-seeklogo.com.png' alt='react-router' />
    </a>
</div>
<br />
<a href='https://badge.fury.io/js/siegel' target='_blank'>
    <img src='https://badge.fury.io/js/siegel.svg' alt='npm version' />
</a>

<a href='https://david-dm.org/cybercookie/siegel' target='_blank'>
    <img src='https://david-dm.org/cybercookie/siegel.svg' alt='Dependency Status' />
</a>

<a href="">
    <img src='https://github.com/cybercookie/siegel/workflows/build/badge.svg' alt='build' />
</a>

<br /><br />
<h1>siegel</h1>


<h3>Description</h3>
<p>
    Finally*! Package you been waiting for long is already here to abstract all the boring routines you've been doing submissively on every project.<br />
    Now nothing can stop you from diving into a business logic right after installation.
</p>
<h6>
    *The project is workable but still in alpha stage.<br />
    Some configurations may change in the future. Docs are not well written so far.
</h6><br />

Siegel is a website development platform that provides an easy way to build and host your project using big set of predefined components and other usefull client side utils like request service, routing, state managers etc.

Read more about each part (build, server. ui) following the links below:
- [UI](https://github.com/CyberCookie/siegel/tree/master/src/ui_core)
- [Build](https://github.com/CyberCookie/siegel/tree/master/src/ui_build)
- [Server](https://github.com/CyberCookie/siegel/tree/master/src/server)

There are also two additional parts worth of mentioning (scripts, demo project):
- [CLI commands](https://github.com/CyberCookie/siegel/tree/master/src/scripts) - siegel helper scripts.
- [Demo project](https://github.com/CyberCookie/siegel/tree/master/demo_app) - for inner tests and project installation.


The platform is highly flexible thus allows you to use it in various ways depending on your needs.
All the approaches are described further.


<br />
<h3>Using globally</h3><hr /><br />

First install siegel globally:

```sh
npm i siegel -g
```

Create simple <b>app.ts</b> file somewhere in your filesystem:

```ts
import { render } from 'react-dom'

render(
    'hello world',
    document.getElementById('root')
)
```

Exec the next command to build the file (<b>-b</b>) and to host it (<b>-s</b>) using inner static server:

```sh
siegel run -b -s -js ./app.ts
```

And that's it! Now you can open <b>localhost:3000</b> to observe the result.<br />


Sure it's just a simple case for testing purposes. Lets make something more serious!<br />
To initialize a real like project with global siegel dependency (<b>-g</b>) use the next commands:

```sh
siegel init -g && siegel install-peers
```

Here we initialize a demo project in a current dirrectory along with a package.json (if not yet exists) and
install siegel's peer dependencies (for TS and ESLint)<br />
Now you have project skeleton with preconfigured siegel in it!<br />
Use various <b>npm commands</b> from updated <b>package.json</b> to perform build, code validation and static serving in development or production mode.<br />

For example:

```sh
npm run dev
```

> Initializing a project with global siegel installation is tricky since we need to define path to global node modules in tsconfig.json and .eslintrc.<br />
> This path may vary on different machines.

More about demo project and its npm scripts read [here](https://github.com/CyberCookie/siegel/tree/master/demo_app).<br />
To print help information call siegel without arguments.


<br />
<h3>Using locally</h3><hr /><br />

Lets perform the same actions from above but having this package installed locally:<br />

```sh
npm i siegel
```

Again, for testing purposes we can create the <b>app.ts</b> file we used above and build it using local siegel installation:

```sh
node ./node_modules/.bin/siegel run -b -s -js ./app.ts
```

<br />
To initialize project template locally use these commands:<br />

```sh
node ./node_modules/.bin/siegel init && node ./node_modules/.bin/siegel install-peers
```


<br />
<h3>Use as a module</h3><hr />

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

[->> Build configuration](https://github.com/CyberCookie/siegel/tree/master/src/ui_build)<br />
[->> Server configuration](https://github.com/CyberCookie/siegel/tree/master/src/server)

```js
{   
    /*
        Affects both server(as public dir to be served),
        and ui_build(as webpack output folder).
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