// const cssSVG                = require('iconfont-webpack-plugin')
const sass                  = require('sass')
const autoprefixer          = require('autoprefixer')
const cssMinifier           = require('cssnano')
const miniCssExtract        = require('mini-css-extract-plugin')

const CONSTANTS             = require('../../constants')


function getModules(CONFIG, RUN_PARAMS) {
    const input = CONFIG.build.input;

    const { isProd, isServer } = RUN_PARAMS;
    const isExtractCSS = isProd || !isServer;


    const loadersInclude = ([ CONSTANTS.PATHS.uiCore ]).concat(input.include)



    return { rules: [
        {
            test: /\.(js|jsx|ts|tsx)$/,
            include: loadersInclude,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-react', '@babel/typescript'],
                        plugins: [
                            'react-hot-loader/babel',
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-syntax-dynamic-import'
                            // ['@babel/plugin-proposal-class-properties', { loose: true }]
                        ]
                    }
                },
                {
                    loader: 'eslint-loader',
                    options: {
                        emitWarning: true
                    }
                }
            ]
        },

        {
            test: /\.sass$/,
            include: loadersInclude,
            use: [
                isExtractCSS ? miniCssExtract.loader : 'style-loader',
                
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: !isProd,
                        importLoaders: 3,
                        url: url => url.endsWith('.svg'),
                        modules: {
                            localIdentName: isProd ? '[hash:base64:4]' : '[local]--[hash:base64:4]'
                        }
                    }
                },

                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: !isProd,
                        plugins: loader => [
                            autoprefixer({ overrideBrowserList: 'last 1 version' }),
                            cssMinifier({ preset: 'default' })
                            //TODO:
                            // new cssSVG(loader)
                        ]
                    }
                },

                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: !isProd,
                        implementation: sass
                    }
                },

                // use with css modules
                {
                    loader: 'sass-resources-loader',
                    options: {
                        resources: input.sassResources
                    }
                }
            ]
        }
    ]}
}


module.exports = getModules