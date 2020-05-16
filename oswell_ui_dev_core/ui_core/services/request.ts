type FetchParams = {
    url: RequestInfo,
    options: RequestInit
}

type ReqError = {
    message: string,
    status: number,
    req: FetchParams,
    res: any
}

type SetupFnParams = {
    beforeRequest?: (opts: RequestFnParams) => RequestFnParams,
    afterRequest?: (fetchParams: FetchParams, parseRes: any) => void,
    errorHandler?: (error: ReqError) => void
} & Indexable

type RequestFnParams = {
    url: RequestInfo,
    parseMethod?: string,
    query?: string | string[][] | Record<string, string> | URLSearchParams
} & RequestInit


function setup(newDefaults: SetupFnParams): void {
    for (const key in newDefaults)
        defaultSetup[key] = newDefaults[key]
} 

const defaultSetup: SetupFnParams = {}


const extractRequestData = (request: RequestFnParams) => {
    const { query, headers, method, body, credentials } = request;
    let url = request.url;

    const options: RequestInit = {}
    let _method;

    if (body) {
        options.body = JSON.stringify(body)
        _method = 'POST'
    } else _method = 'GET'

    options.method = method || _method;
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
    beforeRequest && (req = beforeRequest(req))

    const reqData = extractRequestData(req)

    try {
        const res = await fetch(reqData.url, reqData.options)
        const parsedRes = await extractResponseData(req, res)

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