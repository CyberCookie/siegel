const proxy = require('../../src/server/proxy')

module.exports = (app: any, { express }: any) => {
    app.use(express.json()) // remove if use proxy since body will be corrupted on the other end.

    app.post('/api/send_data', (req: any, res: any) => {
        res.json( req.body )
    })

    app.get('/api/proxy_get/:id', proxy({
        host: 'jsonplaceholder.typicode.com',
        path: '/todos/:id',
        changeOrigin: true
    }))
}