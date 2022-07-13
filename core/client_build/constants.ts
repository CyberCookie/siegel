import { createRequire } from 'module'
import webpack from 'webpack'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import { ESBuildMinifyPlugin } from 'esbuild-loader'
import HTMLPlugin from 'html-webpack-plugin'
import optimizeCSS from 'css-minimizer-webpack-plugin'
import fileCopyPlugin from 'copy-webpack-plugin'
import compressionPlugin from 'compression-webpack-plugin'
import miniCssExtract from 'mini-css-extract-plugin'
import reactRefresh from '@pmmmwh/react-refresh-webpack-plugin'
import eslint from 'eslint-webpack-plugin'

import serviceWorkerPlugin from './plugins/plugin_sw.js'


const { resolve } = createRequire(import.meta.url)

const DEPENDENCIES = {
    webpack, devMiddleware, hotMiddleware,
    esBuildMinifyPlugin: ESBuildMinifyPlugin,

    plugins: {
        HTMLPlugin, optimizeCSS, fileCopyPlugin, compressionPlugin, reactRefresh, eslint,
        serviceWorkerPlugin, miniCssExtract
    },

    loaders: {
        esbuild:                resolve('esbuild-loader'),
        styleLoader:            resolve('style-loader'),
        cssLoader:              resolve('css-loader'),
        postCssLoader:          resolve('postcss-loader'),
        sassLoader:             resolve('sass-loader'),
        sassResourcesLoader:    resolve('sass-resources-loader'),
        postCssAutoprefix:      resolve('autoprefixer'),
        postCssSVG2Font:        resolve('./modules/postcss_svg2icon_plugin/index.cjs')
    }
} as const


const COMMONS = {
    ESLintExtensions: [ '.js', '.jsx', '.ts', '.tsx' ]
} as const

const loadersKeyMap = {
    esbuild: 'esbuildLoader',
    styleLoader: 'styleLoader',
    cssFinal: 'cssFinal',
    cssLoader: 'cssLoader',
    postCssLoader: 'postCssLoader',
    sassLoader: 'sassLoader',
    sassResources: 'sassResources'
} as const

const webpackModulesRegExp = {
    scripts: '\\.[tj]sx?$',
    styles: '\\.(c|sc|sa)ss$',
    files: '\\.(avif|webp|jpg|png|svg|woff2)?$'
} as const


export {
    loadersKeyMap, webpackModulesRegExp,
    DEPENDENCIES, COMMONS
}