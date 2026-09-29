//TODO: Set up a timeout fallback mechanism inside runMiddleware so that poorly written or hung third-party middlewares don't leave your Promise unresolved indefinitely.


import { Socket } from 'node:net'
import { IncomingMessage, ServerResponse } from 'node:http'


type AnyMiddleware = (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err: any) => void | Promise<void>
) => void



function getNodeReq(req: Request) {
    const { url, headers } = req
    const { pathname, search } = new URL(url)

    return Object.assign(
        new IncomingMessage(new Socket()),
        {
            method: req.method,
            url: pathname + search,
            headers: Object.fromEntries(headers)
        } as IncomingMessage
    )
}

const chunkToBuffer = (chunk: any) => typeof chunk === 'string'
    ?   Buffer.from(chunk || '')
    :   chunk


function handleHmrStream(
    hotMiddleware: AnyMiddleware,
    req: Request,
    serverInstance: Bun.Server<unknown>
): Response {

    serverInstance?.timeout(req, 0) // Disable Bun idle timeout

    const nodeReq = getNodeReq(req)
    let stream: ReadableStreamDefaultController | null = null

    const nodeRes = Object.assign(new ServerResponse(nodeReq), {
        statusCode: 200,
        setHeader() { return this },
        writeHead() { return this },
        write(chunk: any) {
            if (stream) {
                try { stream.enqueue( chunkToBuffer(chunk) ) }
                catch { stream = null }
            }

            return !!stream
        },
        end(chunk: any) {
            if (stream) {
                if (chunk) {
                    const buffer = chunkToBuffer(chunk)
                    try { stream.enqueue(buffer) } catch {} // eslint-disable-line no-empty
                }

                try { stream.close() } catch {} // eslint-disable-line no-empty
            }
        }
    })


    hotMiddleware(nodeReq, nodeRes, () => {})


    return new Response(
        new ReadableStream({
            start(controller) {
                stream = controller
            },
            cancel() {
                stream = null
            }
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        }
    )
}



const runMiddleware = (
    middleware: AnyMiddleware,
    req: Request
): Promise<{ handled: boolean; response?: Response }> => (

    new Promise(resolve => {
        const nodeReq = getNodeReq(req)

        let statusCode = 200
        const headers = new Headers()
        const chunks: Uint8Array[] = []

        const nodeRes = Object.assign(new ServerResponse(nodeReq), {
            get statusCode() {
                return statusCode
            },
            set statusCode(code) {
                statusCode = code
            },
            setHeader(name, value) {
                headers.set(name, String(value))
                return this
            },
            writeHead(code, statusMessageOrHeaders, headersMap) {
                statusCode = code

                const incomingHeaders = typeof statusMessageOrHeaders === 'object'
                    ?   statusMessageOrHeaders
                    :   headersMap

                if (incomingHeaders) {
                    for (const [ key, val ] of Object.entries(incomingHeaders)) {
                        headers.set(key, String(val))
                    }
                }
                return this
            },
            write(chunk) {
                chunks.push( chunkToBuffer(chunk) )
                return true
            },
            end(chunk) {
                chunk && chunks.push( chunkToBuffer(chunk) )

                resolve({
                    handled: true,
                    response: new Response(
                        Buffer.concat(chunks),
                        {
                            status: statusCode,
                            headers
                        }
                    )
                })
            }
        } as ServerResponse)

        middleware(nodeReq, nodeRes, err => {
            if (err) console.error('Middleware Error:', err)
            resolve({ handled: false })
        })
    })
)


export { runMiddleware, handleHmrStream }