# Client build

<p>Provides API to bundle react applications using configurable abstraction around webpack's config and to retrieve dev middlewares thats could be used in express app</p>

The build exports object with two methods:
- `run` - **(config, runParams)**. Creates webpack compiller and runs it to produce a bundle<br />
    - Receives **2** parameters:
        - **config** - More about config read further
        - **runParams** - Siegel run params
    - Returns promise which resolved with webpack compiller<br /><br />

- `getDevMiddlewares` - (config, webpackCompiller)** - Returns an object with webpack dev and hot middlewares
 

<br />

### Builder features

<br />

- Transform React JSX and TypeScript files via ESBuild
- Code splitting
- Service worker plugin to provide the best caching strategy
- SASS/SCSS processing; style autoprefixing; css modules
- Transform SVG icons into woff(2) icon font
- Sourcemaps for styles and scripts
- JS linting
- Hot relaod client script and styles
- All output files are minified and compressed
- Static assets handle
- Various tweaks and optimizations to make it fast


<br /><br />

## Config

<br />

<p>Config is optimized to produce the smallest bundle as fast as possible</p>


This config allows you to bring any changes to an underlying webpack configuration,<br />
by providing an easy to use api<br />
All the fields are optional since many of them are already defined in core  default configuration

<br />


```js
{
    /* Output path */
    publicDir: String,

    /* Build specific config */
    build: {
        input: {
            /*
                List of directories and/or files to be processed by webpack's loaders
            */
            include: String[],
            
            /*
                List of directories and/or files to exclude from being processed by webpack's loaders
            */
            exclude: String[]

            /*
                Path to react application entrypoint
                Default is: [cwd]/app.ts)
            */
            js: String,

            /* Path to service worker */
            sw: String,

            /*
                Path to site entrypoint
                Default is: [cwd]/client/index.html ( App container div's id = root )
            */
            html: String | HTMLWebpackPlugin::options | (defaultConfig) => htmlWebpackPluginOptions,

            /*
                CopyWebpackPlugin assets path
                If specified as string then it will be transformed to
                [{
                    from: copyFilesDir,
                    to: join( publicDir, relative( dirname(input.html) copyFilesDir) )
                }]
            */
            copyFiles: String || CopyWebpackPlugin::options::patterns,

            /*
                Path to styles files which will be included in every other styles file
                (Usefull for variables / mixins)
            */
            sassResources: String,

            /*
                Enables svg2icon postcss plugin and set rootPath relatively to which icon paths will be resolved
            */
            iconsRoot:String
        },

        output: {
            /*
                target EcmaScript version
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
                    In runtime there will be only PROD or DEV fields, depending on selected mode
                */ 
                PROD: {
                    assets: String          // Default is: assets/[contenthash][ext]
                    js: String              // Default is: [contenthash].js
                    js_chunk: String        // Default is: [contenthash].js
                    styles: String          // Default is: [contenthash].css
                    styles_chunk: String    // Default is: [contenthash].css
                    brotli: String          // Default is: [base].br
                    gzip: String            // Default is: [base].gz
                },
                DEV: {
                    assets: String          // Default is: assets/[name][ext]
                    js: String              // Default is: app.[contenthash].js
                    js_chunk: String        // Default is: chunk.[name][contenthash].js
                    styles: String          // Default is: styles.[name].css
                    styles_chunk: String    // Default is: chunk.[name].css
                    brotli: String          // Default is: [base].br
                    gzip: String            // Default is: [base].gz
                }
            }
        }

        /* 
            Enables ESlint
            Default false
        */
        eslint: Boolean | ESLintWebpackPlugin::options | (defaultConfig) => eslintWebpackPluginOptions,


        /* Webpack aliases */
        aliases: Object,

        /*
            Webpack plugins config
            Plugins configuration topic is further
        */
        plugins: Object,

        /*
            Webpack loaders config
            Modules configuration topic is further
        */
        modules: Object,

        /*
            Postprocess the final webpack config before being passed to webpack
            Receives webpack config as a first parameter, siegel config as a second and
            build constants (build dependencies, plugin/loader keys) as third
        */
        postProcessWebpackConfig: Function
    }
}
```

<br />

### Plugins

Every default plugin has its own `plugin key`
- compression-webpack-plugin ( `compression` ) - Enabled if **runParams.isProd == true**<br />
  May have several instances with these `instance keys` : brotli (`br`) and gzip (`gzip`)
- copy-webpack-plugin ( `copy` ) - enabled if **config.build.input.copyFiles** is specified
- mini-css-extract-plugin ( `cssExtract` ) - enabled if **runParams.isProd == true** or if **runParams.isServer == false**
- html-webpack-plugin ( `html` ) - enabled if **config.build.input.html** is specified
- clean-webpack-plugin ( `clean` )
- EsLint ( `eslint` ) - Eslint plugin, Enabled if **config.build.esbuil == true**
- webpack HHMR plugin (`hot`) - enabled if **runParams.isProd == false**
- @pmmmwh/react-refresh-webpack-plugin ( `reactRefresh` ) - enabled if **runParams.isProd == true**
- <a href='#sw_plugin'>(custom) service worker plugin</a> ( `sw` ) - enabled if **config.build.input.sw** is specified
    - the only option it accepts is a file path to your service worker. The only purpose of the plugin is to create an array called `buildOutput` in a service worker to hold all the output files webpack produces


<br />

To extend default plugins or instances you should use `plugin keys` or `instance keys`

```js
import somePlugin from 'some_webpack_plugin'


{
    plugins: {
        compression: {
            instances: {
                br: {
                    options: { /* plugin instance options */ }
                },

                gzip: false // to disable plugin instance
            }
        },

        sw: {
            enable: false // to disable plugin
        },

        html: {
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
        your_plugin_key: {
            plugin: somePlugin,
            options: { /* plugin options */ }
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
const config = {
    // ...build config,

    plugins: {
        sw: {
            options: 'path/to/source/sw.js'
        }
    }
}
```

```js
// service worker file sw.js

// Variable is put during a build phase.
console.log(buildOutput) // [ 'index.js', 'assets/fonts/some_font.woff2' ]
```

Require service worker file as you'd usually do:

```js
navigator.serviceWorker?.register('/sw.js')
    .catch(console.error)
```


<br /><br />

### Module and Rules

Each loader has its own `loader key` to make it easy to extend it<br />
Loaders used by default together with `file extensions regexp` are described below<br />


- Workers<br />
RegExp string: `_worker\\.[tj]s$` (**worker**)<br />
Loaders:
    - worker-loader ( `workers` )<br /><br />

- Scripts<br />
RegExp string: `\\.[tj]sx?$` (**scripts**)<br />
Loaders:
    - ESBuild ( `esbuildLoader` )<br /><br />

- Styles<br />
RegExp string: `\\.(c|sc|sa)ss$` (**styles**)<br />
Loaders:
    - SASS ( `sassLoader` )
    - CSS ( `cssLoader` )
    - ( `cssFinal` ) MiniCSSExtractPlugin **if runParams.isProd || !runParams.isServer, else** Style loader
    - SASS resources ( `sassResources` )
    - PostCSS ( `postCssLoader` )
        - autoprefixer
        - <a href='#postcss_plugin'>(custom) svg to font plugin</a><br /><br />

- Assets loader<br />
RegExp string: `\\.(avif|webp|jpg|png|svg|woff2)?$` (**assets**)

<br />

```js
import { BUILD_CONSTANTS } from 'siegel'


const { loadersKeyMap, webpackModuleRulesRegExp } = BUILD_CONSTANTS

{
    // ...build config

    module: {
        /* Add new moduleRule key to the rules order */
        order(defaultOrder) {
            return [ ...defaultOrder, 'png|ico' ]
        },

        /* Pass some module options */
        moduleOptions: {},

        rules: {
            [ webpackModuleRulesRegExp.styles ]: {
                /*
                    This field can be a function in the case you extend one of default rules.
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
                            This field can be a function in case you extend one of default loaders. 
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
            
            [ webpackModuleRulesRegExp.files ]: {
                /*
                    Provide new regexp for all loaders
                    that use [ webpackModuleRulesRegExp.files ] regexp
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
                        options: {}
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
}
```


<br /><br />

### <a id='postcss_plugin'>SVG icons to font PostCSS plugin</a>

<br />

Plugin allows you to define paths to svg icons in your css classes.<br />
During css transformation the paths are stripped and `::before` pseudoelement with icon declaration<br /> will be added to the class<br /><br />


Example input:

```css
.all_icons {
    font-icon-common: ''; // empy string so far
}

.some_icon::before {
    font-icon: 'path/to/some_icon.svg';
}
.another_icon::after {
    font-icon: 'path/to/another_icon.svg';
}

.some_icon-orphan::after {
    font-icon-orphan: './relative/path/to/orphan_icon.svg';
}
```

Where `.all_icons` it's an example classname for every icon.<br />And `.some_icon` it's an example classname for particular icon you want to tie svg icon to.<br />
Pathes are related to `iconsRoot` in build config<br /><br />

You may declare empty `font-icon-common` property once per css file.<br />
It's to declare `@font-face` and `font-family` rules once per all classes with `font-icon` declaration in this file,<br />
thus reducing output css size.<br />


Example output:

```css
@font-face {
    font-family: Iconfont_e4e66c75c348e94b357d5545459817c3; src:url('data:application/x-font-woff;charset=utf-8;base64, _BASE64_FONT_ ') format('woff2');
}
@font-face {
    font-family: Iconfont_3738493040df8d5d9c9ad8e7er0fc9ad; src:url('data:application/x-font-woff;charset=utf-8;base64, _BASE64_FONT_ ') format('woff2');
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
    content: '\e001';
}
.another_icon::after {
    content: '\e002'
}


.some_icon-orphan::after {
    content: '\e003';
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: normal;
    font-style: normal;
    font-family: Iconfont_3738493040df8d5d9c9ad8e7er0fc9ad;
}
```

There are two options you can pass to the plugin:
```js
import { BUILD_CONSTANTS } from 'siegel'


const {
    loadersKeyMap, webpackModuleRulesRegExp,
    DEPENDENCIES: { loaders }
} = BUILD_CONSTANTS

const config = {
    // ...build config

    module : {
        rules: {
            [webpackModuleRulesRegExp.styles]: {
                loaders: {
                    [loadersKeyMap.postCssLoader]: {
                        options(defaultOptions) {
                            // our plugin is a second in a postcss plugins array
                            defaultOptions.postcssOptions.plugins[1] = loaders.postCssSVG2Font({
                                fontNamePrefix: 'font_prefix',
                                isWoff2: true
                            })
    
                            return defaultOptions
                        }
                    }
                }
            }
        }
    }
}
```

<br />

> `Postcss loader` holds css `autoprefixer` and `svg to icon` plugins.<br />
> Thus it is hard to rewrite the plugin options since `postcss` accepts functions as plugins.<br />
> See example above of how to update `postcss` plugins configuration.<br />
> Just keep in mind that by default <b>it has array of two plugins</b>, where first is `autoprefixer` and second one is `svg to icon` plugin



<br /><hr />
<details>
    <summary>TODO</summary>
    - Output pure ESM<br />
    - Save font icon to a separate file<br />
    - Separate styles for different media queries<br />
    - Generate code documentation from TS
</details>