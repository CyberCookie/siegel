import type { ConfigObject } from '../../../types'


type GetStaticFileResponseParams = (
    params: {
        serverConfig: ConfigObject['server']
        req: Request
        htmlFileName: string
        publicDir: ConfigObject['publicDir']
    }
) => {
    file: Bun.BunFile
    headers: HeadersInit
}


export type { GetStaticFileResponseParams }