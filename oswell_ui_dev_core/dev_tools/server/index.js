//  HTTPS version

// const https = require('https'),
//     fs = require('fs');
// https
//     .createServer({
//         key: fs.readFileSync(path.join(process.cwd(), 'server', 'cert', 'key.pem')),
//         cert: fs.readFileSync(path.join(process.cwd(), 'server', 'cert', 'certificate.pem'))
//         // pfx: fs.readFileSync(path.join(process.cwd(), 'server', 'cert', './certificate.p12')), 
//         // passphrase: 'secret'
//     }, app)
//     .listen(serverConfig.nodePort, serverConfig.nodeHost, err => {
//         err
//             ? console.error(err)
//             : console.info('Starting server on %s:%s.', serverConfig.nodeHost, serverConfig.nodePort) 
//     })
const express = require('express')
const expressStatic = require('express-static-gzip')
const historyApiFallback = require('connect-history-api-fallback')

const app = express()
app.disable('x-powered-by')


module.exports = {
    run: (CONFIG, devMiddlewares = [], serverExtend) => {
        let { host, port } = CONFIG.server;

        app.use(historyApiFallback())
        devMiddlewares.forEach(m => app.use(m))


        serverExtend && serverExtend(app)


        app.use('/', expressStatic(CONFIG.build.output.loc, {
            enableBrotli: true,
            orderPreference: ['br', 'gzip']
        }))
        
        
        return app.listen(port, host, err => {
            err
                ?   console.error(err)
                :   console.info('Starting server on %s:%s.', host, port) 
        })
    }
}