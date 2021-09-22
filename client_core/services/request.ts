type FetchParams = {
    url: string
    options: RequestInit
}

type ReqError = {
    req: FetchParams
    message?: string
    status?: number
    res?: any
}

type SetupFnParams = {
    beforeRequest?(opts: RequestParams): void | Promise<RequestParams>
    afterRequest?(fetchParams: FetchParams, parseRes: any): void
    errorHandler?(error: ReqError): void
} & Indexable

type RequestParams = {
    url: string
    isFullRes?: boolean
    parseMethod?: string
    params?: Indexable<string>
    query?: string | string[][] | Indexable<string> | URLSearchParams
    headers?: Indexable<string>
    credentials?: RequestInit['credentials']
    method?: RequestInit['method']
    signal?: RequestInit['signal']
    body?: any
}


function setup(newDefaults: SetupFnParams): void {
    for (const key in newDefaults) defaultSetup[key] = newDefaults[key]
}

const defaultSetup: SetupFnParams = {}

const HEADER_CONTENT_TYPE = 'content-type'

function extractRequestData(request: RequestParams) {
    const { url, query, params, headers, body, credentials, signal } = request
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


    return {
        initialURL: url,
        url: fetchURL,
        options
    }
}


async function extractResponseData(req: RequestParams, res: Response & Indexable): Promise<any> {
    let parseMethod = req.parseMethod
    let contentType

    if (!parseMethod) {
        parseMethod = 'text'
        contentType = res.headers.get(HEADER_CONTENT_TYPE)

        if (contentType) {
            if (contentType.startsWith('application/json')) {
                parseMethod = 'json'
            } else if (contentType.startsWith('multipart/form-data')
                || contentType.startsWith('application/x-www-form-urlencoded')) {

                parseMethod = 'formData'
            }
        }
    }

    try { return await res[parseMethod]() }
    catch (err) { throw new Error(
        `${err}. Failed to parse contentType: ${contentType} using ${parseMethod}() method.`
    )}
}


async function makeRequest(req: RequestParams) {
    const { afterRequest, errorHandler } = defaultSetup

    const reqData = extractRequestData(req)


    try {
        const res = await fetch(reqData.url, reqData.options)
        const { headers, status, statusText } = res

        let parsedRes = await extractResponseData(req, res)
        req.isFullRes && (parsedRes = {
            status, statusText, headers,
            data: parsedRes
        })

        if (res.ok) {
            afterRequest?.(reqData, parsedRes)
            return {
                res: parsedRes,
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
            err
        }
    }
}


function request(req: RequestParams) {
    const { beforeRequest } = defaultSetup

    const asyncInterceptor = beforeRequest?.(req)

    return asyncInterceptor
        ?   asyncInterceptor.then(makeRequest)
        :   makeRequest(req)
}


export { setup, HEADER_CONTENT_TYPE }
export default request
export type { FetchParams, ReqError, SetupFnParams, RequestParams }