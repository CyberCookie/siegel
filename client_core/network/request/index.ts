import type { FetchParams, ReqError, RequestParams, Hooks } from './types'


const HEADERS = {
    CONTENT_TYPE: 'content-type'
}

const CONTENT_TYPE = {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    X_FORM: 'application/x-www-form-urlencoded'
}

const jsonContentTypeHeaders = {
    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON
}


function extractRequestData(request: RequestParams) {
    const { url, query, params, headers, body, credentials, signal, json } = request
    let fetchURL = url as string

    const options: RequestInit = { method: request.method }


    if (body) {
        options.body = body
        options.method ||= 'POST'
    }
    options.method ||= 'GET'

    //TODO: duplicate in src/server/proxy
    if (params) {
        for (const param in params) {
            fetchURL = fetchURL.replace(':' + param, params[param])
        }
    }

    if (query) {
        const queryToAdd = typeof query == 'string'
            ?   query
            :   `?${(new URLSearchParams(query)).toString()}`

        fetchURL += queryToAdd
    }

    credentials && (options.credentials = credentials)
    headers && (options.headers = headers)
    signal && (options.signal = signal)


    if (json) {
        options.body && (options.body = JSON.stringify(options.body))
        options.headers
            ?   ((options.headers as Indexable)[HEADERS.CONTENT_TYPE] ||= CONTENT_TYPE.JSON)
            :   (options.headers = jsonContentTypeHeaders)
    }


    return {
        initialURL: url,
        url: fetchURL,
        options
    }
}


async function extractResponseData(req: RequestParams, res: Response): Promise<any> {
    let { parseMethod } = req
    let contentType

    if (!parseMethod) {
        parseMethod = 'text'
        contentType = res.headers.get(HEADERS.CONTENT_TYPE)

        if (contentType) {
            if (req.json || contentType.startsWith(CONTENT_TYPE.JSON)) {
                parseMethod = 'json'

            } else if (contentType.startsWith(CONTENT_TYPE.FORM_DATA)
                || contentType.startsWith(CONTENT_TYPE.X_FORM)) {

                parseMethod = 'formData'
            }
        }
    }

    try { return await res[parseMethod as 'json' | 'formData' | 'text']() }
    catch (err) { throw new Error(
        `${err}. Failed to parse contentType: ${contentType} using ${parseMethod}() method.`
    )}
}


const createApi = (hooks: Hooks = {}) => {
    const { beforeParse, beforeRequest, afterRequest, errorHandler, json } = hooks
    const activeRequest = new Set()


    return async function request<Res = any, Body = any>(req: RequestParams<Body>) {
        req.json ||= json

        const ifAsync = beforeParse?.(req)
        if (ifAsync) await ifAsync.then(_req => { req = _req })

        const { isFullRes, preventSame = true } = req
        const reqData = extractRequestData(req)

        let reqKey
        preventSame && (reqKey = `${reqData.url}_${reqData.options.method}_${reqData.options.body}`)


        beforeRequest?.(reqData)
        req.beforeRequest?.(reqData)
        try {
            if (preventSame) {
                if (activeRequest.has(reqKey)) {
                    throw {
                        err: new Error('Same request is already processing'),
                        canceled: true
                    }
                } else activeRequest.add(reqKey)
            }

            const res = await fetch(reqData.url, reqData.options)
            const { headers, status, statusText } = res

            let parsedRes = await extractResponseData(req, res)
            isFullRes && (parsedRes = {
                status, statusText, headers,
                data: parsedRes
            })

            if (res.ok) {
                preventSame && activeRequest.delete(reqKey)
                afterRequest?.(reqData, parsedRes)

                return {
                    res: parsedRes as Res,
                    err: null
                }
            } else throw {
                status: res.status,
                message: res.statusText,
                res: parsedRes
            }
        } catch (err) {
            (err as ReqError).req = reqData

            errorHandler?.(err as ReqError)

            return {
                res: null,
                err: err as ReqError
            }
        }
    }
}


export { HEADERS, CONTENT_TYPE }
export default createApi
export type { FetchParams, ReqError, Hooks, RequestParams }