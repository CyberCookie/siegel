import type { ServerExtenderFn } from 'siegel'


const appServer: ServerExtenderFn = req => {
    const { method, url } = req
    const { pathname } = new URL(url)

    let response: Response | undefined
    if (method === 'GET' && pathname == '/hello') {
        response = new Response('hello world')
    }


    return { response }
}


export default appServer