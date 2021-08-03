const { proxyReq } = require('./siegel_lib')


module.exports = (app: any, { express }: any) => {
    app.post('/api/send_data', (req: any, res: any) => {
        res.json( req.body )
    })

    app.get('/api/proxy_get/:id', proxyReq({
        host: 'jsonplaceholder.typicode.com',
        path: '/todos/:id',
        changeOrigin: true
    }))

    app.use(express.json())
}
export {}