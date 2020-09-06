# ui_build
Provides NodeJS API to bundle react applications using configurable abstraction around webpack's config and to retrieve dev middlewares that are used as express middlewares. The build exports object with two methods:
- __run(config, runParams)__ - creates webpack compiller and runs it to produce a bundle. Returns a promise which resolves with webpack compiller.
- __getDevMiddlewares(config, webpackCompiller)__ - creates an object with dev and hot middlewares using webpack compiller. These middlewares are passing into express dev server.

#### Default webpack config description:
Config optimized to produce the smallest bundle and to build it as fast as possible. If you know how to make it faster - let me know :)
Also this config includes:
- code splitting
- js minimization
- sourcemaps
##### Modules section
- js transformation with babel using presets and plugins:
    - @babel/preset-react
    - @babel/preset-typescript
    - @babel/plugin-proposal-export-default-from
    - @babel/plugin-proposal-export-namespace-from
    - @babel/plugin-syntax-dynamic-import
    - react-refresh/babel
- ESLint
- SASS styles
- postCSS
    - autoprefixer
    - css minifier
- CSS modules
- sass-resources-loader (to include mixins and variables imports in every css file. Normally CSS modules breaks this functionality)

##### Plugins section
There is a special approach to configure plugins described in [config section](https://github.com/CyberCookie/siegel). For this puproses you will need to specify `plugin key`.
- compression-webpack-plugin (`compression`) - (brotli and gzip). Enabled if __runParams.isProd == true__
- copy-webpack-plugin (`copy`) - enabled if __config.build.input.assetsDir__ is specified
- serviceworker-webpack-plugin (`sw`) - enabled if __config.build.input.sw__ is specified
- mini-css-extract-plugin (`cssExtract`) - enabled if __runParams.isProd == true__ or if __runParams.isServer == false__ 
- html-webpack-plugin (`html`) - enabled if __config.build.input.html__ is specified
- clean-webpack-plugin (`clean`)
- @pmmmwh/react-refresh-webpack-plugin (`reactRefresh`) - enabled if __runParams.isProd == true__

If you want to add additional plugin then no special key is required. At least it shouldn't overlap with existing one.