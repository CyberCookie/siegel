"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { join } = require('path');
const glob = require('glob');
const { PATHS } = require('../constants');
const buildConstants = require('./constants');
const { pluginsKeysMap, loadersKeyMap, webpackModulesRegExp } = buildConstants;
module.exports = () => {
    const RUN_PARAMS = {
        isBuild: true,
        isProd: true
    };
    const CONFIG = {
        build: {
            input: {},
            plugins: {
                [pluginsKeysMap.compression]: false,
                [pluginsKeysMap.html]: false,
                [pluginsKeysMap.eslint]: false
            },
            modules: {
                [webpackModulesRegExp.styles]: {
                    loaders: {
                        [loadersKeyMap.sassResources]: false
                    }
                }
            },
            postProcessWebpackConfig(webpackConfig) {
                // const newEntry = {}
                // glob.sync(
                //     join(PATHS.clientCore, '**', '*.ts*'),
                //     {
                //         //TODO: make it buildable
                //         ignore: [
                //             '**/*.d.ts',
                //             '**/signalr*',
                //             '**/store/redux/**/*',
                //             '**/ui/Spinner/**/*'
                //         ]
                //     }
                // ).forEach(e => {
                //     newEntry[e.replace(PATHS.clientCore, '')] = e
                // })
                // webpackConfig.entry = newEntry
                // console.log(newEntry)
                // webpackConfig.entry = {
                //     '/ui/Button': join(PATHS.clientCore, 'ui', '_form', 'Button', 'index.tsx'),
                //     '/ui/Checkbox': join(PATHS.clientCore, 'ui', '_form', 'Checkbox', 'index.tsx'),
                //     '/ui/Slider': join(PATHS.clientCore, 'ui', 'Slider', 'index.tsx')
                // }
                webpackConfig.entry = join(process.cwd(), '_test', 'some_module.js');
                webpackConfig.externals = {
                    react: 'react'
                };
                webpackConfig.output = {
                    filename: '[name].js',
                    path: join(PATHS.cwd, '_test', 'output'),
                    library: {
                        type: 'module'
                    },
                    environment: { module: true }
                };
                webpackConfig.experiments = { outputModule: true };
                // webpackConfig.externalsType = 'module'
                delete webpackConfig.cache;
                delete webpackConfig.resolve.alias;
                return webpackConfig;
            }
        }
    };
    return { RUN_PARAMS, CONFIG };
};
