import type { ServerExtenderFn, FastifyHTTPServer } from '../core'


const appServer: ServerExtenderFn = server => {
    (server as FastifyHTTPServer)
        .get('/hello', (_, res) => {
            res.send('hello world')
        })
}


export default appServer