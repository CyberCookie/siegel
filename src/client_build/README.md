# Client build

<p>Provides API to bundle react applications using configurable abstraction around webpack's config and to retrieve dev middlewares that are used in express static server</p>

The build exports object with two methods:
- `run` - **(config, runParams)**. Creates webpack compiller and runs it to produce a bundle<br />
    - Receives **2** parameters:
        - **config** - More about config read further
        - **runParams** - Siegel run params
    - Returns promise which resolved with webpack compiller<br /><br />

- `getDevMiddlewares` - (config, webpackCompiller)** - Returns an object with webpack dev and hot middlewares
 

<br />

### What it can do out of the box?

<p>Config optimized to produce the smallest bundle and to build it as fast as possible</p>

Features:
- Code splitting
- All output files are minified and compressed
- Sourcemaps
- JS Lint
- Transform React JSX and TypeScript files via ESBuild
- SASS/SCSS processing; style autoprefixing; css modules
- Transform SVG icons into woff(2) font
- Service worker plugin to provide the best caching strategy
- Hot relaod client js, styles and nodejs server when changes occurs


<br /><br />

## Config

<br />


This config allows you to bring any changes to an underlying webpack configuration,<br />
providing an easy to use api<br />
All the fields are optional since many of them are already defined in the underlying default webpack configuration

<br />


```js
{
    /* Output path */
    publicDir: String,

    /* Build specific config */
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
            html: String || HTMLWebpackPlugin::options || (defaultConfig) => updatedConfig,

            /*
                CopyWebpackPlugin assets path.
                If specified as string then it will be transformed to
                [{
                    from: copyFilesDir,
                    to: join( publicDir, relative( dirname(input.html) copyFilesDir) )
                }]
            */
            copyFiles: String || CopyWebpackPlugin::options::patterns,

            /*
                Path to styles files which will be included in every other styles file.
                (Usefull for variables / mixins).
            */
            sassResources: String,

            /*
                List of directories and/or files to be processed by webpack's loaders.
            */
            include: String[],
            
            /*
                List of directories and/or files to exclude from being processed by webpack's loaders.
            */
            exclude: String[]
        },

        output: {
            /*
                target EcmaScript version.
                Default is: es2020
            */
            target: String,

            /*
                Webpack publicPath
                Default is: /
            */
            publicPath: String,

            /* Output files naming format */
            filenames: {
                /*
                    There will be PROD's or DEV's fields, depending on selected mode.
                */ 
                PROD: {
                    assets: String          // Default is: assets/[contenthash].[ext]
                    js: String              // Default is: [contenthash].js
                    js_chunk: String        // Default is: [contenthash].js
                    styles: String          // Default is: [contenthash].css
                    styles_chunk: String    // Default is: [contenthash].css
                    brotli: String          // Default is: [name].br
                    gzip: String            // Default is: [name].gz
                },
                DEV: {
                    assets: String          // Default is: assets/[name].[ext]
                    js: String              // Default is: app.[contenthash].js
                    js_chunk: String        // Default is: chunk.[name][contenthash].js
                    styles: String          // Default is: styles.[name].css
                    styles_chunk: String    // Default is: chunk.[name].css
                }
            }
        }

        /* 
            Enables ESlint.
            Default false
        */
        eslint: Boolean || ESLintWebpackPlugin::options || (defaultConfig) => updatedConfig,


        /* Webpack aliases */
        aliases: Object,

        /*
            Webpack plugins config.
            Read below the way to use it.
        */
        plugins: Object,

        /*
            Webpack loaders config.
            Read below the way to use it.
        */
        modules: Object,

        /*
            Use it to post process a final webpack config before being passed to webpack.
            Receives siegel config as a first parameter, webpack config as a second and
            build constants (build dependencies, plugin/loader keys ).
        */
        postProcessWebpackConfig: Function
    }
}
```

<br />

### Plugins

Every plugin, that's already included, has its own `plugin key`
- compression-webpack-plugin ( `compression` ) - Enabled if **runParams.isProd == true**<br />
  May have several instances with these `instance keys` : brotli (`br`) and gzip (`gzip`)
- copy-webpack-plugin ( `copy` ) - enabled if **config.build.input.copyFiles** is specified
- mini-css-extract-plugin ( `cssExtract` ) - enabled if **runParams.isProd == true** or if **runParams.isServer == false**
- css-minimizer-webpack-plugin ( `cssOptimize` ) - enabled if **runParams.isProd == true** 
- html-webpack-plugin ( `html` ) - enabled if **config.build.input.html** is specified
- clean-webpack-plugin ( `clean` )
- EsLint ( `eslint` ) - Eslint plugin, Enabled if **config.build.esbuil == true**
- webpack HHMR plugin (`hot`) - enabled if **runParams.isProd == false**
- @pmmmwh/react-refresh-webpack-plugin ( `reactRefresh` ) - enabled if **runParams.isProd == true**
- <a href='#postcss_plugin'>(custom) service worker plugin</a> ( `sw` ) - enabled if **config.build.input.sw** is specified
    - the only option it accepts is a file path to your service worker. The only purpose of the plugin is to create an array called `buildOutput` in a service worker to hold all the output files webpack produces


<br />

To extend default plugins or instances you should use `plugin keys` or `instance keys`

```js
import { BUILD_CONSTANTS } from 'siegel'
import somePlugin from 'some_webpack_plugin'


const { pluginsKeysMap, pluginInstancesKeyMap } = BUILD_CONSTANTS

{
    plugins: {
        [ pluginsKeysMap.compression ]: {
            instances: {
                [ pluginInstancesKeyMap.compression_br ]: {
                    options: { /* plugin instance options */ }
                },

                [ pluginInstancesKeyMap.compression_gzip ]: false // to disable the plugin instance
            }
        },

        [ pluginsKeysMap.sw ]: false, // to disable the plugin

        [ pluginsKeysMap.html ]: {
            options: { /* plugin options */ }

            /* could be a function with default options as a first parameter */
            options(defaultOptions) {
                defaultOptions.scriptLoading = 'defer'
                return defaultOptions
            }
        },

        
        /*
            If you want to add additional plugin then no special key is required.
            At least it shouldn't overlap with existing ones.
        */
        [ your_plugin_key ]: {
            plugin: somePlugin,
            enabled: true,
            options: { /* plugin options */ }
        }
    }
}
```


<br />

### Modules

Each loader has its own `loader key` to make it easy to extend it<br />
Loaders used by default together with `related file extensions` are described below


- ESBuild ( `esbuild` ) <br />
RegExp string: **\\.[tj]sx?$** ( `scripts` )<br /><br />

- Styles<br />
RegExp string: **\\.(c|sc|sa)ss$** ( `styles` )
    - SASS ( `sassLoader` )
    - CSS ( `cssLoader` )
    - MiniCSSExtractPlugin **if run params are isProd || !isServer, else** Style loader ( `cssFinal` )
    - SASS resources ( `sassResources` )
    - PostCSS ( `postCssLoader` )
        - autoprefixer
        - <a href='#sw_plugin'>(custom) svg to font plugin</a><br /><br />

- Webpack v5 assets loader<br />
RegExp string: **\\.(avif|webp|jpg|png|svg|woff2)?$** (`files` )

<br />

```js
import { BUILD_CONSTANTS } from 'siegel'


const { loadersKeyMap, webpackModulesRegExp } = BUILD_CONSTANTS

{
    modules: {
        [ webpackModulesRegExp.styles ]: {
            /*
                This field can be a function in the case you extend one of the default rules.
                The Function receives default laodersOrder and returns new one. 
            */
            loadersOrder(defaultLoadersOrder) {
                /* Remember that webpack' loaders executes starting from the end */

                /* To add to the beginning. */
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
                [ loadersKeyMap.sassResources ]: false,

                [ loadersKeyMap.cssLoader ]: {
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
        
        [ webpackModulesRegExp.files ]: {
            /*
                Provide new regexp for all loaders
                that use [ webpackModulesRegExp.files ] regexp
            */
            rewriteRegExp: '(png|jpg|woff2?|svg)'
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
                include: [ 'path_to_png_ico_files' ]
            }
        }
    }
}
```

<br /><br />

### <a id='sw_plugin'>Service worker plugin</a>

<br />

The only purpose of this plugin is to place an array of build output assets into a service worker thus enabling some tricks to use in caching strategies<br />
**Plugin emits an output service worker file to the destination root**<br />


```js
// siegel config

import { BUILD_CONSTANTS } from 'siegel'


const { pluginsKeysMap } = BUILD_CONSTANTS

{
    // ...client_build config,

    plugins: {
        [pluginsKeysMap.sw]: {
            options: 'path/to/source/sw.js'
        }
    }
}
```

```js
// service worker file sw.js

// Variable is put during the build phase.
console.log(buildOutput) // [ 'index.js', 'assets/fonts/some_font.woff2' ]
```

Require service worker file as you'd usually do:

```js
navigator.serviceWorker?.register('/sw.js')
    .catch(console.error)
```


<br /><br />

### <a id='postcss_plugin'>SVG icons to font PostCSS plugin</a>

<br />

Plugin that transforms svg icons paths in your css into font

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

There are two options you can pass to the plugin:
```js
import { BUILD_CONSTANTS } from 'siegel'


const { loadersKeyMap, webpackModulesRegExp } = BUILD_CONSTANTS

const config = {
    // ...client build config

    modules: {
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
    <summary>TODO</summary>
    - ES modules<br />
    - Save font icon to a separate file<br />
    - Separate styles for different media queries<br />
    - Generate code documentation from TS
</details>