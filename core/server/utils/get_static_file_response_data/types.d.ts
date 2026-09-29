import type { ConfigObject } from '../../../types'


type GetStaticFileResponseDataParams = {
    serverConfig: ConfigObject['server']
    req: Request
    htmlFileName: string
    publicDir: ConfigObject['publicDir']
}


export type { GetStaticFileResponseDataParams }