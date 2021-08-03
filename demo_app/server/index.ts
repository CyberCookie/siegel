const siegel = require('./siegel_lib')


const RUN_ARGUMENTS = new Set(process.argv)

const isProd = RUN_ARGUMENTS.has('-p')
isProd && (process.env.NODE_ENV = 'production')



siegel(
    require('./siegel_config'),
    {
        isProd,
        isServer: RUN_ARGUMENTS.has('-s'),
        isBuild: RUN_ARGUMENTS.has('-b')
    }
)
export {}