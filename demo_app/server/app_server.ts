/*
    requiring siegel proxy.
    Rewrite to require('siegel/cjs/server/proxy') or global path,
    once demo project is inited
*/
const { dirname, join } = require('path')

const siegelPath        = require('./siegel_resolve')
const proxy             = require( join(dirname(siegelPath), 'server', 'proxy') )


module.exports = (app: any, { express }: any) => {
    app.post('/api/send_data', (req: any, res: any) => {
        res.json( req.body )
    })

    app.get('/api/proxy_get/:id', proxy({
        host: 'jsonplaceholder.typicode.com',
        path: '/todos/:id',
        changeOrigin: true
    }))

    app.use(express.json())
}