interface FetchParams {
    url: RequestInfo,
    options: RequestInit
}

interface SetupFnParams extends Indexable {
    beforeRequest?: (opts: FetchParams) => FetchParams,
    afterRequest?: (fetchParams: FetchParams, parseRes: Promise<any>) => void,
    errorHandler?: (error: Error, req: FetchParams) => void
}

interface RequestFnParams extends RequestInit {
    url: RequestInfo,
    parseMethod?: string,
    query?: string | string[][] | Record<string, string> | URLSearchParams
}


function setup(newDefaults: SetupFnParams): void {
    for (let key in newDefaults)
        defaultSetup[key] = newDefaults[key]
} 

const defaultSetup: SetupFnParams = {}


const extractRequestData = (request: RequestFnParams) => {
    const { url, query, headers, method, body, credentials } = request;

    const options: RequestInit = { method: method || 'GET' }
    credentials && (options.credentials = credentials)
    headers && (options.headers = headers)
    if (body) {
        options.body = JSON.stringify(body)
        method || (options.method = 'POST')
    }
    
    const fetchParams = { url, options }

    query && (fetchParams.url += `?${(new URLSearchParams(query)).toString()}`)


    return defaultSetup.beforeRequest
        ?   defaultSetup.beforeRequest(fetchParams)
        :   fetchParams
}


const extractResponseData = async (req: RequestFnParams, res: Response & Indexable): Promise<any> => {
    let parseMethod = req.parseMethod;
    let contentType;

    if (!parseMethod) {
        parseMethod = 'text';
        contentType = res.headers.get('content-type');

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
    let reqData = extractRequestData(req)

    try {
        let res = await fetch(reqData.url, reqData.options)
        let parsedRes = await extractResponseData(req, res)

        if (res.ok) {
            defaultSetup.afterRequest && defaultSetup.afterRequest(reqData, parsedRes)
            return parsedRes
        } else {
            throw {
                status: res.status || 500,
                message: res.statusText,
                res: parsedRes,
                req: reqData
            }
        }
    } catch (err) {
        defaultSetup.errorHandler && defaultSetup.errorHandler(err, reqData)
        throw err
    }
}


export { setup }
export default request

module.hot && module.hot.decline()