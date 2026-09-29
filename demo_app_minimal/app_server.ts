import type { ServerExtenderFn } from 'siegel'


const appServer: ServerExtenderFn = server => {
    (server as FastifyHTTPServer)
        .get('/hello', (_, res) => {
            res.send('hello world')
        })
}


export default appServer