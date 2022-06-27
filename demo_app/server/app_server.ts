import { proxyReq } from '../../core'


function appServer({ express, onStream, staticServer }: any) {
    if (onStream) { // if HTTP2
        onStream(() => {
            console.log('HTTP2 stream')
        })

    } else {
        staticServer
            .use(express.json())

            .post('/api/echo', (req: any, res: any) => {
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