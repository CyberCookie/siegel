type FetchParams = {
    url: string
    options: RequestInit
}
type ReqData = {
    initialURL: string
    url: string
    options: RequestInit
}

type ReqError = {
    req: ReqData
    message?: string
    status?: number
    res?: any
}

type RequestParams<_Body = any> = {
    url: string
    isFullRes?: boolean
    parseMethod?: string
    params?: Record<string, string>
    query?: string | Record<string, string> | URLSearchParams
    headers?: Record<string, string>
    credentials?: RequestInit['credentials']
    method?: RequestInit['method']
    signal?: RequestInit['signal']
    body?: _Body
    json?: boolean
    preventSame?: boolean
    beforeRequest?: Hooks['beforeRequest']
}

type Hooks = {
    beforeParse?(opts: RequestParams): void | Promise<RequestParams>
    beforeRequest?(reqData: ReqData): void
    afterRequest?(reqData: ReqData, parsedRes: any): void
    errorHandler?(error: ReqError): void
    json?: RequestParams['json']
}


export type { FetchParams, ReqData, ReqError, RequestParams, Hooks }