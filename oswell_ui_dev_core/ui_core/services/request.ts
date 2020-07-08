//TODO: abort

type FetchParams = {
    url: RequestInfo
    options: RequestInit
}

type ReqError = {
    message: string
    status: number
    req: FetchParams
    res: any
}

type SetupFnParams = {
    beforeRequest?: (opts: RequestFnParams) => void
    afterRequest?: (fetchParams: FetchParams, parseRes: any) => void
    errorHandler?: (error: ReqError) => void
} & Indexable

type RequestFnParams = {
    url: RequestInfo
    isFullRes?: boolean
    parseMethod?: string
    query?: string | string[][] | Record<string, string> | URLSearchParams
} & RequestInit & { headers?: Indexable }


function setup(newDefaults: SetupFnParams): void {
    for (const key in newDefaults) defaultSetup[key] = newDefaults[key]
} 

const defaultSetup: SetupFnParams = {}


const extractRequestData = (request: RequestFnParams) => {
    const { query, headers, body, credentials } = request;
    let { url, method } = request;

    const options: RequestInit = {}


    if (body) {
        options.body = JSON.stringify(body)
        method || (method = 'POST')
    }

    options.method = method || 'GET'
    query && (url += `?${(new URLSearchParams(query)).toString()}`)
    credentials && (options.credentials = credentials)
    headers && (options.headers = headers)
    
    
    const fetchParams = { url, options }

    return fetchParams
}


const extractResponseData = async (req: RequestFnParams, res: Response & Indexable): Promise<any> => {
    let parseMethod = req.parseMethod;
    let contentType;

    if (!parseMethod) {
        parseMethod = 'text'
        contentType = res.headers.get('content-type')

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
        `${err}. Failed to parse contentType: ${contentType}, with: ${parseMethod}() method.`
    )}
}


const request = async (req: RequestFnParams) => {
    const { beforeRequest, afterRequest, errorHandler } = defaultSetup;
    beforeRequest && beforeRequest(req)

    const reqData = extractRequestData(req)

    try {
        const res = await fetch(reqData.url, reqData.options)
        const { headers, status, statusText } = res;

        let parsedRes = await extractResponseData(req, res)
        req.isFullRes && (parsedRes = {
            status, statusText, headers,
            data: parsedRes
        })

        if (res.ok) {
            afterRequest && afterRequest(reqData, parsedRes)
            return parsedRes
        } else {
            throw {
                status: res.status,
                message: res.statusText,
                res: parsedRes
            }
        }
    } catch (err) {
        const finalErr = {
            req: reqData,
            res: err.res,
            status: err.status || 500,
            message: err.message || err.toString()
        }


        errorHandler && errorHandler(finalErr)
        throw err
    }
}


export { setup }
export default request

module.hot && module.hot.decline()