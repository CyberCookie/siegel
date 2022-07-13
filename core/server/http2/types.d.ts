import type { ServerHttp2Stream, IncomingHttpHeaders } from 'http2'


type StreamCB = (
    stream: ServerHttp2Stream,
    headers: IncomingHttpHeaders,
    flags: number
) => void


export type { StreamCB }