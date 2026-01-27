import type { ServerExtenderFn, ExpressExtenderParams } from '../core'


const appServer: ServerExtenderFn = params => {
    const { express, staticServer } = params as ExpressExtenderParams

    staticServer
        .use(express.json())
}


export default appServer