import populateURLParams from '../../../common/populate_url_params'
import isExists from '../../../common/is/exists'

import type { RequestParamsProcessed, ReqError, RequestParams, SetupParams } from './types'


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

const jsonParseMethod = 'json'


function extractRequestData(request: RequestParams) {
    const {
        url, query, params, method, headers, body, credentials, signal,
        json, jsonStringifyPostprocess
    } = request

    const options: RequestParamsProcessed['options'] = { method }

    if (body) {
        options.body = body
        options.method ||= 'POST'
    }
    options.method ||= 'GET'

    let fetchURL = params
        ?   populateURLParams(url, params)
        :   url


    if (query) {
        const queryToAdd = query instanceof String
            ?   query
            :   `?${(new URLSearchParams(query))}`

        fetchURL += queryToAdd
    }

    credentials && (options.credentials = credentials)
    headers && (options.headers = headers)
    signal && (options.signal = signal)


    if (json) {
        if (options.body) {
            options.body = JSON.stringify(options.body)
            if (jsonStringifyPostprocess) {
                options.body = jsonStringifyPostprocess(options.body)
            }
        }

        options.headers
            ?   (options.headers[HEADERS.CONTENT_TYPE] ||= CONTENT_TYPE.JSON)
            :   (options.headers = jsonContentTypeHeaders)
    }


    return {
        initialURL: url,
        url: fetchURL,
        options
    }
}


async function extractResponseData(req: RequestParams, res: Response): Promise<any> {
    const { jsonParsePreprocess } = req
    let { parseMethod } = req
    let contentType

    if (!parseMethod) {
        parseMethod = 'text'
        contentType = res.headers.get(HEADERS.CONTENT_TYPE)

        if (contentType) {
            if (contentType.startsWith(CONTENT_TYPE.JSON)) {
                parseMethod = jsonParseMethod

            } else if (contentType.startsWith(CONTENT_TYPE.FORM_DATA)
                || contentType.startsWith(CONTENT_TYPE.X_FORM)) {

                parseMethod = 'formData'
            }
        }
    }

    try {
        return jsonParsePreprocess && parseMethod == jsonParseMethod
            ?   JSON.parse(
                    jsonParsePreprocess(await res.text())
                )

            :   await res[parseMethod]()
    } catch (err) { throw new Error(
        `${err}. Failed to parse contentType: ${contentType} using ${parseMethod}() method.`
    )}
}

async function isAllowedToProcess(
    beforeRequest: RequestParams['beforeRequest'],
    reqData: ReturnType<typeof extractRequestData>
) {

    const currentBeforeReqResult = beforeRequest?.(reqData)
    let isAllowedToProcess: boolean | void = true

    if (isExists(currentBeforeReqResult)) {
        if (typeof currentBeforeReqResult == 'object') {
            await currentBeforeReqResult.then(shouldProcess => {
                isAllowedToProcess = shouldProcess
            })

        } else isAllowedToProcess = currentBeforeReqResult
    }


    return isAllowedToProcess
}


const createApi = (setupParams: SetupParams = {}) => {
    const {
        preventSame: preventSameGlobal,
        beforeParse, beforeRequest, afterRequest, errorHandler,
        json, jsonParsePreprocess, jsonStringifyPostprocess
    } = setupParams
    const activeRequest = new Set()


    return async <Res = any, Body = any>(req: RequestParams<Body, Res>) => {

        if (!isExists(req.json)) {
            req.json = json
        }

        req.jsonStringifyPostprocess ||= jsonStringifyPostprocess
        req.jsonParsePreprocess ||= jsonParsePreprocess


        const ifAsync = beforeParse?.(req)
        if (ifAsync) await ifAsync.then(_req => { req = _req })

        const { isFullRes, preventSame } = req

        const reqData = extractRequestData(req)
        const { options, url } = reqData

        const isSameReqPrevent = preventSame != false && (preventSame || preventSameGlobal)

        let reqKey
        isSameReqPrevent && (reqKey = `${url}_${options.method}_${options.body}`)


        const globalReqAllowed = await isAllowedToProcess(beforeRequest, reqData)
        const isReqAllowed = globalReqAllowed && await isAllowedToProcess(req.beforeRequest, reqData)

        if (isReqAllowed) {
            try {
                if (isSameReqPrevent) {
                    if (activeRequest.has(reqKey)) {
                        throw {
                            err: new Error('Same request is already processing...'),
                            canceled: true
                        }
                    } else activeRequest.add(reqKey)
                }

                const res = await fetch(url, options)
                const { headers, status, statusText, ok } = res

                let parsedRes = await extractResponseData(req, res)
                isSameReqPrevent && activeRequest.delete(reqKey)

                isFullRes && (parsedRes = {
                    status, statusText, headers,
                    data: parsedRes
                })


                if (ok) {
                    afterRequest?.(reqData, parsedRes)
                    req.onSuccess?.(parsedRes as Res)

                    return {
                        res: parsedRes as Res,
                        err: null
                    }

                } else throw {
                    status,
                    message: statusText,
                    res: parsedRes
                }

            } catch (err) {
                isSameReqPrevent && activeRequest.delete(reqKey)

                ;(err as ReqError).req = reqData

                const preventGlobalHandler = req.onError?.(err as ReqError)
                preventGlobalHandler || errorHandler?.(err as ReqError)


                return {
                    res: null,
                    err: err as ReqError
                }
            }

        } else return { res: null, err: null }
    }
}


export default createApi
export type { RequestParamsProcessed, ReqError, RequestParams, SetupParams }