const cssSVG                = require('iconfont-webpack-plugin')
const sass                  = require('sass')
const autoprefixer          = require('autoprefixer')
const cssMinifier           = require('cssnano')
const miniCssExtract        = require('mini-css-extract-plugin')

const CONSTANTS             = require('../../constants')


function getModules(CONFIG, RUN_PARAMS) {
    const input = CONFIG.build.input;

    const { isProd, isServer } = RUN_PARAMS;
    const isExtractCSS = isProd || !isServer;


    let loadersInclude = [CONSTANTS.PATHS.uiCore]
    Array.isArray(input.include)
        ?   (loadersInclude = loadersInclude.concat(input.include))
        :   loadersInclude.push(input.include)
    
    let loadersExclude = [/*CONSTANTS.PATHS.nodeModules*/]
    Array.isArray(input.exclude)
        ?   (loadersExclude = loadersExclude.concat(input.exclude))
        :   loadersInclude.push(input.exclude)



    const MODULE_RULES = [
        {
            test: /\.(js|jsx|ts|tsx)$/,
            include: loadersInclude,
            exclude: loadersExclude,
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
                            '@babel/plugin-syntax-dynamic-import',
                            ['@babel/plugin-proposal-class-properties', { loose: true }]
                        ]
                    }
                },
                {
                    loader: 'eslint-loader',
                    options: {
                        emitWarning: true,
                        // eslintPath: __dirname
                    }
                }
            ]
        },

        {
            test: /\.sass$/,
            include: loadersInclude,
            exclude: loadersExclude,
            use: [
                isExtractCSS ? miniCssExtract.loader : 'style-loader',
                
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: !isProd,
                        importLoaders: 3,
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
                            cssMinifier({ preset: 'default' }),
                            new cssSVG(loader)
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
    ]


    return MODULE_RULES
}



module.exports = getModules