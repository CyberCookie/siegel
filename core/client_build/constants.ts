import { createRequire } from 'module'
import webpack from 'webpack'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import HTMLPlugin from 'html-webpack-plugin'
import fileCopyPlugin from 'copy-webpack-plugin'
import compressionPlugin from 'compression-webpack-plugin'
import miniCssExtract from 'mini-css-extract-plugin'
import reactRefresh from '@pmmmwh/react-refresh-webpack-plugin'
import eslint from 'eslint-webpack-plugin'
import postCssAutoprefix from 'autoprefixer'
import TerserWebpackPlugin from 'terser-webpack-plugin'

import serviceWorkerPlugin from './plugins/plugin_sw.js'
import postCssSVG2Font from './module_rules/postcss_svg2icon_plugin'


const { resolve } = createRequire(import.meta.url)

const DEPENDENCIES = {
    webpack, devMiddleware, hotMiddleware,

    plugins: {
        swcMinify: TerserWebpackPlugin.swcMinify,
        HTMLPlugin, fileCopyPlugin, compressionPlugin, reactRefresh, eslint,
        serviceWorkerPlugin, miniCssExtract, TerserWebpackPlugin
    },

    loaders: {
        postCssAutoprefix, postCssSVG2Font,

        swcLoader:              resolve('swc-loader'),
        workerLoader:           resolve('worker-loader'),
        styleLoader:            resolve('style-loader'),
        cssLoader:              resolve('css-loader'),
        postCssLoader:          resolve('postcss-loader'),
        sassLoader:             resolve('sass-loader'),
        sassResourcesLoader:    resolve('sass-resources-loader')
    }
} as const


const COMMONS = {
    ESLintExtensions: [ '.js', '.jsx', '.ts', '.tsx' ]
} as const


const pluginsKeysMap = {
    compression: 'compression',
    copy: 'copy',
    cssExtract: 'cssExtract',
    sw: 'sw',
    cssOptimize: 'cssOptimize',
    hot: 'hot',
    html: 'html',
    reactRefresh: 'reactRefresh',
    clean: 'clean',
    eslint: 'eslint'
} as const


const loadersKeyMap = {
    swcLoader: 'swcLoader',
    workers: 'workers',
    styleLoader: 'styleLoader',
    cssFinal: 'cssFinal',
    cssLoader: 'cssLoader',
    postCssLoader: 'postCssLoader',
    sassLoader: 'sassLoader',
    sassResources: 'sassResources'
} as const

const webpackModuleRulesRegExp = {
    scripts: '\\.[tj]sx?$',
    worker: '__worker\\.[tj]s$',
    styles: '\\.(c|sc|sa)ss$',
    files: '\\.(avif|webp|jpe?g|png|svg|woff2?)$'
} as const


export {
    loadersKeyMap, pluginsKeysMap, webpackModuleRulesRegExp,
    DEPENDENCIES, COMMONS
}