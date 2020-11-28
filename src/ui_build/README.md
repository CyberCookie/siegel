<h1>ui_build</h1>

<p>Provides API to bundle react applications using configurable abstraction around webpack's config and to retrieve dev middlewares that are used in express static server.</p>

<ul>
    <b>The build exports object with two methods:</b>
    <li>
        <b>run(config, runParams)</b> - creates webpack compiller and runs it to produce a bundle. Returns a promise which resolves with webpack compiller.
    </li>
    <li>
        <b>getDevMiddlewares(config, webpackCompiller)</b> - returns an object with dev and hot middlewares using webpack compiller.
    </li>
</ul>
 

<br />
<h3>What it does out of the box?</h3>

<p>Config optimized to produce the smallest bundle and to build it as fast as possible. If you know how to make it faster - let me know :)</p>

<ul>
    <b>Default features:</b>
    <li>Code splitting</li>
    <li>All output files are minified and compressed</li>
    <li>Sourcemaps</li>
    <li>JS Lint</li>
    <li>Transform React JSX and TypeScript files via Babel along with new syntax (included plugins / presets are listed below)</li>
    <li>SASS/SCSS processing; style autoprefixing; css modules</li>
    <li>Transform SVG icons into woff(2) font</li>
    <li>Autoreload on file change</li>
    <li>Best service worker expirience</li>
</ul>


<br />
<h3>Config</h3>

```js
{
    /* Output path */
    staticDir: String,

    build: {
        input: {
            /*
                Path to react application entrypoint.
                Default is: path.join(process.cwd(), 'app.ts')
            */
            js: String,

            /* Path to service worker. */
            sw: String,

            /*
                Path to site entrypoint.
                Default is: demo_app/client/index.html ( App container div's id = root )
            */
            html: String,

            /* Path to application static assets folder. */
            assetsDir: String,

            /*
                Path to styles files which will be included in every other styles file.
                (Usefull for variables / mixins).
            */
            sassResources: String,

            /*
                List of directories and/or files to be processed by webpack's loaders.
                Default is: [ ui_core, path.dirname(build.input.js) ]
            */
            include: String[],
            
            /*
                List of directories and/or files to exclude from being processed by webpack's loaders.
                Default is: [ siegel's node_modules ]
            */
            exclude: String[]
        },

        /* Webpack publicPath */
        publicPath: String,

        /* Webpack aliases */
        aliases: Object,

        /*
            Webpack plugins passed in extendable form.
            Read below the way to use it.
        */
        plugins: Object,

        /*
            Webpack modules passed in extendable form.
            Read below the way to use it.
        */
        modules: Object,

        /*
            Use it to post process a final webpack config before being passed to webpack.
            Receives siegel config as a first parameter, webpack config as a second and
            all the dependencies used in webpack config including webpack itself as a third parameter.
        */
        postProcessWebpackConfig: Function
    }
}
```

<br />
<h3>Plugins</h3>

Every plugin, that's already included, has its own `plugin key`.
- compression-webpack-plugin ( `compression` ) - Enabled if __runParams.isProd == true__.<br />
  May have several instances with these `instance keys` : brotli (`br`) and gzip (`gzip`).
- copy-webpack-plugin ( `copy` ) - enabled if __config.build.input.assetsDir__ is specified
- mini-css-extract-plugin ( `cssExtract` ) - enabled if __runParams.isProd == true__ or if __runParams.isServer == false__
- optimize-css-assets-webpack-plugin ( `cssOptimize` ) - enabled if __runParams.isProd == true__ 
- html-webpack-plugin ( `html` ) - enabled if __config.build.input.html__ is specified
- clean-webpack-plugin ( `clean` )
- @pmmmwh/react-refresh-webpack-plugin ( `reactRefresh` ) - enabled if __runParams.isProd == true__
- <a href='#postcss_plugin'>(custom) service worker plugin</a> ( `sw` ) - enabled if __config.build.input.sw__ is specified
    - the only option it accepts is a file path to your service worker. The only purpose of the plugin is to create an array called `buildOutput` in a service worker to hold all the output files webpack produces. 


<br />

To extend default plugins or instances you should use `plugin keys` or `instance keys`

```js
const { pluginsKeysMap, pluginInstancesKeyMap } = require('siegel/src/ui_build/constants')

{
    plugins: {
        [pluginsKeysMap.compression]: {
            instances: {
                [pluginInstancesKeyMap.compression_br]: {
                    options: { /* plugin instance options */ }
                },

                [pluginInstancesKeyMap.compression_gzip]: false // to disable the plugin instance
            }
        },

        [pluginsKeysMap.sw]: false, // to disable the plugin

        [pluginsKeysMap.html]: {
            options: { /* plugin options */ }

            /* could be a function with default options as a first parameter */
            options(defaultOptions) {
                defaultOptions.scriptLoading = 'defer'
                return defaultOptions
            }
        },

        
        /*
            If you want to add additional plugin then no special key is required.
            At least it shouldn't overlap with existing one.
        */
        [your_plugin_key]: {
            plugin: require('your_plugin'),
            enabled: true,
            options: { /* plugin options */ }
        }
    }
}
```


<br />
<h3>Modules</h3>

Loaders that this build is use by default. Each loader has its own `loader key` to make it possible to extend it.

- Babel: ( `babel` )
    - @babel/preset-react
    - @babel/preset-typescript
    - @babel/plugin-proposal-export-default-from
    - @babel/plugin-proposal-export-namespace-from
    - @babel/plugin-syntax-dynamic-import
    - @babel/plugin-proposal-logical-assignment-operators
    - @babel/plugin-proposal-optional-chaining
    - react-refresh/babel
- ESLint ( `eslint` )
- SASS styles ( `cssFinal` )<br />
    It is <b>style-loader</b> in dev mode<br />
    or <b>mini-css-extract-plugin's loader</b> if mode is production.
- PostCSS ( `postCssLoader` )
    - autoprefixer
    - <a href='#sw_plugin'>(custom) svg to font</a>
- CSS modules ( `css-loader` )
- sass-resources-loader ( `sassResources` )<br />
    (to include mixins and variables imports in every css file. Normally CSS modules breaks this functionality)


To extend default modules you should operate with `loader keys` and with `regExp parts` to math the file extensions:

```js
const { loadersKeyMap, webpackModulesRegExp } = require('siegel/src/ui_build/constants')

{
    modules: {
        [webpackModulesRegExp.styles]: {
            /*
                This field can be a function in the case you extend one of the default rules.
                The Function receives default laodersOrder and returns new one. 
            */
            loadersOrder(defaultLoadersOrder) {
                /* Remember that webpack' loaders executes starting from the end */

                /* To add to the begining. */
                defaultLoadersOrder.push('your_loader')

                /* To add to the end. */
                defaultLoadersOrder.unshift('your_loader')

                /* One of the ways to remove the loader. */
                defaultLoadersOrder.splice(
                    defaultLoadersOrder.indexOf(loadersKeyMap.sassResources),
                    1
                )

                return defaultLoadersOrder
            },

            loaders: {
                /* Annother way to disable loader */
                [loadersKeyMap.sassResources]: false,

                [loadersKeyMap.cssLoader]: {
                    /*
                        This field can be a function in case you extend one of the default loaders. 
                    */
                    options(defaultLoaderOptions) {
                        delete defaultLoaderOptions.modules;
                        return defaultLoaderOptions
                    }
                },

                your_loader: {
                    loader: String,
                    options: Object
                }
            }
        },

        /* Custom extension handler */
        'png|ico': {
            /* You may ommit this field if only one loader is using. */
            loadersOrder: [ 'loader_key_1', 'loader_key_2' ],

            /*
                Loaders hash with keys you specified in loadersOrder.
                Loader can have any key if the loader is single.
            */
            loaders: {
                /* can be an object when you specify loader and its options separately */
                loader_key_1: {
                    loader: String, // Resoved loader path
                    
                    /* Loader options */ 
                    options: {},

                    /* Any valid field you can pass into webpack's loader but `laoder` and `options`. */
                    additionalLoaderOptions: {}
                },

                /* Can be a string with resolved module path  */
                loader_key_2: String
            },

            /* Any valid field you can pass into webpack's Rule but `test` and `use`. */
            ruleOptions: {
                include: [' path_to_png_ico_files ']
            }
        }
    }
}
```

<br />
<h3>
    <a id='sw_plugin'>Service worker plugin</a>
</h3><br />

The only purpose of this plugin is to place an array of build output assets into a service worker thus enabling some tricks to use in caching strategies.<br />
<b>Plugin emits an output service worker file to the destination root.</b><br />



<b>siegel config</b>

```js
const { pluginsKeysMap } = require('siegel/src/ui_build/constants')

{
    // ...ui_build config,

    plugins: {
        [pluginsKeysMap.sw]: {
            options: 'path/to/source/sw.js'
        }
    }
}
```

<b>sw.js</b>

```js
// Variable is put during the build phase.
console.log(buildOutput) // [ 'index.js', 'assets/fonts/some_font.woff2' ]
```

Require service worker file as you'd usually do:

```js
window.navigator.serviceWorker?.register('/sw.js')
    .catch(console.error)
```


<br />
<h3>
    <a id='postcss_plugin'>SVG icons to font PostCSS plugin</a>
</h3><br />

Plugin that transforms svg icons paths in your css into font.

```css
.all_icons {
    font-icon-root: ''; // empy string so far
}

.some_icon::before {
    font-icon: './relative/path/to/svg_icon.svg';
}
```

Output:

```css
@font-face {
    font-family: Iconfont_e4e66c75c348e94b357d5545459817c3; src:url('data:application/x-font-woff;charset=utf-8;base64, _BASE64_FONT_ ') format('woff');
}

.all_icons {
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: normal;
    font-style: normal;
    font-family: Iconfont_e4e66c75c348e94b357d5545459817c3;
}

.some_icon::before {
    content: '\e003';
}
```

There are twho options you can pass to the plugin:
```js
const { loadersKeyMap, webpackModulesRegExp } = require('../../src/ui_build/constants')

const config = {
    // ...siegel config

    build.modules: {
        [webpackModulesRegExp.styles]: {
            loaders: {
                [loadersKeyMap.postCssLoader]: {
                    options(defaultOptions) {
                        // our plugin is a second in a postcss plugins row
                        const svg2FontPlugin = defaultOptions.postcssOptions.plugins[1]

                        // access options
                        svg2FontPlugin[1] = {
                            fontNamePrefix: 'font_prefix',
                            woff2: true
                        }

                        return defaultOptions
                    }
                }
            }
        }
    }
}
```


<br /><hr />
<details>
    <summary><h5>TODO</h5></summary>
    <ul>
        <li>ES modules</li>
        <li>Save font icon to a separate file</li>
        <li>Separate styles for different media queries</li>
        <li>Generate code documentation from TS</li>
    </ul>
</details>