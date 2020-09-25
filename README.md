# siegel

<a href='https://badge.fury.io/js/siegel'>
    <img src='https://badge.fury.io/js/siegel.svg' alt='npm version' />
</a>

<a href='https://david-dm.org/cybercookie/siegel'>
    <img src='https://david-dm.org/cybercookie/siegel.svg' alt='Dependency Status' />
</a>

<a>
    <img src='https://github.com/cybercookie/siegel/workflows/build/badge.svg' alt='build' />
</a>



<h3>Description</h3>
Finally*! The package you been waiting for long is already here to abstract all the boring routines you've been doing submissively on every project. Now nothing can stop you from diving into a business logic right after installation.
<h6>* the project is workable but still in alpha phase. Some configurations may change in future. Docs are not well written so far.</h6><br />

In general this package is a site development platform that consists of three main parts (UI, build, server) that you can use individually or in conjuction with other parts:
- [ui_core](https://github.com/CyberCookie/siegel/tree/master/src/ui_core) - Front-end related code. It's the only part you will be using directrly.
- [ui_build](https://github.com/CyberCookie/siegel/tree/master/src/ui_build) - webpack build lives here.
- [server](https://github.com/CyberCookie/siegel/tree/master/src/server) - static server is here.

And two helper parts (scripts, demo project):
- [scripts](https://github.com/CyberCookie/siegel/tree/master/src/scripts) - siegel helper scripts.
- [demo project](https://github.com/CyberCookie/siegel/tree/master/demo_app) - for inner tests and project installation.


<h3>Installation</h3>

```sh
npm i siegel
```

You should install some peer dependencies in order to make inner eslint and typescript proper validate your code.

There is an __install_peers.js__ script located in scripts part that can make it easier for you.

<h3>Usage</h3>
siegel it's a function that accepts <b>config</b> as a first argument and <b>runParams</b> as a second.

You may read about these parameters below.

```js
require('siegel')(config, runParams)
```

siegel supports zero configuration mode to make it super easy for you to try it out as soon as possible.

Create app.ts file somewhere in your project:
<h5>app.ts</h5>

```ts
import { render } from 'react-dom'

render(
    'hello world',
    document.getElementById('root')
)
```

Create simple index.js node file: 
<h5>index.js</h5>

```js
require('siegel')(/*relative path to js entrypoint. Default is ./app.ts*/)
```

And execute it via CLI:

```sh
node index.js
```

<br />

If you don't want to bother yourself with project creating and siegel configuring - you can just run from root level script that will create it all for you:

```sh
node ./node_modules/siegel/src/scripts/init_project.js --run --peers
```

You may read about script params in [scripts section](https://github.com/CyberCookie/siegel/tree/master/src/scripts).

<h5>Config<h5>
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
            js: String, // path.join(process.cwd(), 'app.ts')
            sw: String,
            html: String, // demo_project html (<div id='root'...)
            assetsDir: String,
            sassResources: String,
            include: String[], // [ ui_core, path.dirname(build.input.js) ]
            exclude: String[] // [ siegel's node_modules, parent node_modules ]
        },
        output: String, // path.join(process.cwd(), 'dist')
        aliases: Object,

        plugins: Object,

        postProcessWebpackConfig: Function
    }
}
```

##### server
- __extenderLoc__ - path to a user defined server to extend the one created by siegel. Server extender should be a function. Function receives an instance of the server as a first paramenter and dependencies used to create this server as a second.
- __watch__ - reload when some changes in user server occur.
- __host__ - host used in static server.
- __port__ - port used in static server.
- __http2__ - whether to use HTTP2 protocol.
- __ssl.keyPath__ - path to ssl private key.
- __ssl.certPath__ - path to signed certificate.

##### build
__input.js__ - path to react application entrypoint.\
__input.sw__ - path to service worker.\
__input.html__ - path to site entrypoint.\
__input.assetsDir__ - path to application static assets folder.\
__input.sassResources__ - path to styles files which will be included in every other styles file. (Usefull for variables / mixins).\
__output__ - path to folder when output code will be stored.\
__aliases__ - webpack compatible aliases.\
__plugins__ - used to extend siegel webpack plugins or to add your own. There are 8 plugins that are used during the build: `compression`, `copy`, `sw`, `cssExtract`, `html`, `hot`, `clean` and `reactRefresh`. Each of them you may disable or extend with your own options that will be merged with existing ones. Some plugins like `compression` may have several instances (one for brotli and another one for gzip). This example describes how plugins can be configured:

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

<details>
<summary><h5>TODO</h5></summary>
    <ul>Still plenty of work to do in order to make it more flexible and easier to setup. To bring as more optional cool features as possible!
        <li><ul><b>server</b>
            <li>Compatible HTTP1 and HTTP2 static server</li>
            <li>Watch for user server changes recursively</li>
            <li>SEO for crawlers (pages prebuild or build on the fly)</li>
            <li>Isomorphic API</li>
        </ul></li>
        <li><ul><b>ui_build</b>
            <li>ES modules</li>
            <li>Nice way to configure modules</li>
            <li>Separate styles for different media query</li>
            <li>Contribute to the <b>iconfont-webpack-plugin</b> in order to add woff2 support and fix a problem with different contenthash from build to build</li>
            <li>Generate code documentation from TS</li>
        </ul></li>
        <li><ul><b>ui_core</b>
            <li>Prebuild</li>
            <li>PWA</li>
            <li>SEO by updating meta tags on page render</li>
            <li>Resolve TODOs</li>
            <li>Add typization to redux and signalR</li>
            <li>React Native</li>
        </ul></li>
        <li><ul><b>scripts</b>
            <li>Add npm packages update script</li>
            <li>Single command with subcommands</li>
            <li>Move to .bin</li>
            <li>Replace bash commands with node solutions</li>
        </ul></li>
        <li><ul><b>siegel in general</b>
            <li>Get rid of peer dependencies</li>
            <li>Less dependencies</li>
            <li>Better documentation</li>
            <li>Test coverage</li>
            <li>Use as global</li>
            <li>...</li>
            <li>GUI to build complex websites just by dragging components onto a page. GUI to tight it all to DB. Eventually - site builder that powerfull to build your own site builder :)</li>
        </ul></li>
    </ul>
</details>