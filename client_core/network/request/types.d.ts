type ReqData = {
    /** Not processed URL */
    initialURL: string

    /** Final URL */
    url: string

    /** Fetch API request options */
    options: {
        headers?: RequestParams['headers']
    } & Omit<RequestInit, 'headers'>
}

type ReqError = {
    /** Request data */
    req: ReqData

    /** Error responce message */
    message?: string

    /** Error responce code */
    status?: number

    /** Responce data */
    res?: any
}

type RequestParams<_Body = any> = {
    /** Request URL. Can include URL params: _someurl/:param1/:param2_ */
    url: string

    /** URL params that will be included in `url` */
    params?: Record<string, string>

    /** URL query params */
    query?: string | Record<string, any> | URLSearchParams

    /** Request method */
    method?: RequestInit['method']

    /** Request payload */
    body?: _Body

    /** Request headers */
    headers?: Record<string, string>

    /** Returns full response with headers, status code etc */
    isFullRes?: boolean

    /** Method to be executed on response to extract its data */
    parseMethod?: string

    /** Request credentials */
    credentials?: RequestInit['credentials']

    /** Terminates request and prevents browser from response handling */
    signal?: NonNullable<RequestInit['signal']>

    /** For this request applies json content type to headers and parses response as json */
    json?: boolean

    /** For this request prevents request if the same request is already processing */
    preventSame?: boolean

    /** Preprocess mutable request data right before it passed to Fetch API */
    beforeRequest?: Hooks['beforeRequest']
}


type Hooks = {
    /**
     * Triggered before request Object is beeing parsed
     *
     * @param opts - request params
     */
    beforeParse?(opts: RequestParams): void | Promise<RequestParams>

    /**
     * Preprocess mutable request data right before it passed to Fetch API
     *
     * @param reqData fetch api request params
     */
    beforeRequest?(reqData: ReqData): void

    /**
     * Triggered after successful request was made
     *
     * @param reqData - fetch api request params
     * @param parsedRes - parsed responce
     */
    afterRequest?(reqData: ReqData, parsedRes: any): void

    /**
     * Triggered if request was failure
     *
     * @param error - error onject params
     */
    errorHandler?(error: ReqError): void

    /** Applies json content type to headers and parses response as json */
    json?: RequestParams['json']

    /** Prevents request if the same request is already processing */
    preventSame?: boolean
}


export type { ReqData, ReqError, RequestParams, Hooks }