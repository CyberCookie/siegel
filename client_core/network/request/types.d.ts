type RequestParamsProcessed<_P = any> = {
    /** Not processed URL */
    initialURL: string

    /** Final URL */
    url: string

    /** Fetch API request options */
    options: {
        headers?: RequestParams['headers']
    } & Omit<RequestInit, 'headers'>


    passThroughPayload: _P
}


type ReqError<_P = any> = {
    /** Request data */
    req: RequestParamsProcessed<_P>

    /** Error response message */
    message?: string

    /** Error response code */
    status?: number

    /** Responce data */
    res?: any
}

type RequestParams<_Body = any, _Res = any, _P = any> = {
    /** Request URL. Can include URL params: _someurl/:param1/:param2_ */
    url: string

    /** URL params that will be included in `url` */
    params?: Record<string, any>

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
    parseMethod?: 'json' | 'formData' | 'text' | 'arrayBuffer' | 'blob'

    /** Request credentials */
    credentials?: RequestInit['credentials']

    /** Terminates request and prevents browser from response handling */
    signal?: NonNullable<RequestInit['signal']>

    /** For this request applies json content type to headers and parses response as json */
    json?: boolean

    /** For this request prevents request if the same request is already processing */
    preventSame?: boolean

    /** Doesn't affect request itself. Can be handy in global requests interceptors */
    passThroughPayload?: _P

    /**
     * Post process json string before request occurs
     *
     * @param json - request json string
     */
    jsonStringifyPostprocess?(json: string): string

    /**
     * Pre process response string before being parsed to object as json string
     *
     * @param json - response json string
     */
    jsonParsePreprocess?(json: string): string

    /**
     * Postprocess Fetch API's mutable options parameter
     *
     * @param fetchOptions fetch api request options
     */
    fetchOptionsPostprocess?(fetchOptions: RequestInit): void

    /**
     * Preprocess mutable request data right before it passed to Fetch API
     *
     * @param reqData every request params
     * @return false to prevent request execution
     */
    beforeRequest?: NonNullable<SetupParams<_P>['beforeRequest']>

    /** Successful response callback */
    onSuccess?: (res: _Res) => void

    /**
     * Error response callback
     *
     * @param err error object that contains request parameters, response and error message and status
     */
    onError?: (err: ReqError<_P>) => void
}


type SetupParams<_P = any> = {
    /**
     * For every request preprocess mutable request data right before it passed to Fetch API
     *
     * @param reqData request params
     * @return false to prevent request execution
     */
    beforeParse?(opts: RequestParams<any, any, _P>): void | Promise<RequestParams<any, any, _P>>

    /**
     * For every request postprocess mutable Fetch API's options parameter
     *
     * @param fetchOptions fetch api request options
     */
    fetchOptionsPostprocess?(fetchOptions: RequestInit): void

    /**
     * For every request preprocess request data right before it passed to Fetch API
     *
     * @param reqData request params
     */
    beforeRequest?(reqData: RequestParamsProcessed<_P>): void | boolean | Promise<void | boolean>

    /**
     * For every request triggered after successful request was made
     *
     * @param reqData - request params
     * @param parsedRes - parsed response
     */
    afterRequest?(reqData: RequestParamsProcessed<_P>, parsedRes: any): void

    /**
     * For every request triggered if request was failure
     *
     * @param error - error onject params
     */
    errorHandler?(error: ReqError<_P>): void

    /** For every request applies json content type to headers and parses response as json */
    json?: RequestParams['json']

    /** For every request post process json string before request occurs */
    jsonStringifyPostprocess?: RequestParams['jsonStringifyPostprocess']

    /** For every request Pre process response string before being parsed to object as json string */
    jsonParsePreprocess?: RequestParams['jsonParsePreprocess']

    /** Prevents request if the same request is already processing */
    preventSame?: boolean
}


export type { SetupParams, RequestParams, RequestParamsProcessed, ReqError }