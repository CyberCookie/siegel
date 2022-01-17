import { proxyReq } from '../../src/index.js'


function appServer(app, { express, onStream }) {
    if (onStream) { // if HTTP2
        onStream(() => {
            console.log('HTTP2 stream')
        })
    } else {
        app
            .use(express.json())

            .post('/api/echo', (req, res) => {
                res.send(req.body)
            })

            .get('/api/proxy_get/:id', proxyReq({
                host: 'jsonplaceholder.typicode.com',
                path: '/todos/:id',
                changeOrigin: true
            }))
    }
}


export default appServer