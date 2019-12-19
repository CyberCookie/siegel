interface FetchParams {
    url: RequestInfo,
    options: RequestInit
}

interface SetupFnParams extends IndexingObject {
    beforeRequest?: ((opts: FetchParams) => FetchParams) | null,
    afterRequest?: ((fetchParams: FetchParams, parseRes: Promise<any>) => void) | null,
    errorHandler?: ((error: any) => void) | null
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

const defaultSetup: SetupFnParams = {
    beforeRequest: null,
    afterRequest: null,
    errorHandler: null
}


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


const extractResponseData = async (req: RequestFnParams, res: Response & IndexingObject): Promise<any> => {
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
    try {
        let { url, options } = extractRequestData(req)
        let res = await fetch(url, options)
        let parsedRes = await extractResponseData(req, res)

        if (res.ok) {
            defaultSetup.afterRequest && defaultSetup.afterRequest({ url, options }, parsedRes)
            return parsedRes
        } else {
            throw {
                status: res.status || 500,
                message: res.statusText,
                res: parsedRes
            }
        }
    } catch (err) {
        defaultSetup.errorHandler && defaultSetup.errorHandler(err)
        throw err
    }
}


export { setup }
export default request

module.hot && module.hot.decline()