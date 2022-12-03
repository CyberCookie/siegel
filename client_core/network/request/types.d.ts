type ReqData = {
    initialURL: string
    url: string
    options: {
        headers?: RequestParams['headers']
    } & Omit<RequestInit, 'headers'>
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
    params?: Obj<string>
    query?: string | Obj<string> | URLSearchParams
    headers?: Obj<string>
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
    preventSame?: boolean
}


export type { ReqData, ReqError, RequestParams, Hooks }