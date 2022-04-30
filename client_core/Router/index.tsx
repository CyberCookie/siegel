//TODO: prev <> next page transition


import React, { Suspense, useState, useLayoutEffect } from 'react'

import isExists from '../utils/is/exists'
import patchHistory from './patch_history'
import type {
    LazyLayout, LazyPage, Page, Layout, RouterStore,
    GetPageParams, RouterProps, URLparams, RoutesConfig
} from './types'


function getPageElement(pageParams: GetPageParams) {
    const { El, urlParams, onEnter, resultElement, fallback } = pageParams

    const page = (
        <El urlParams={ urlParams } children={ resultElement }
            onEnterData={ onEnter?.(urlParams) } />
    )

    return (El as LazyLayout | LazyPage)._init
        ?   <Suspense fallback={ fallback || '' } children={ page } />
        :   page
}

function PageWrap(pageParams: GetPageParams) {
    useLayoutEffect(() => {
        return () => { pageParams.onLeave!() }
    }, [])

    return getPageElement(pageParams)
}


function Router(props: RouterProps) {
    const { Layout, children, basename } = props

    const routerStore = useState<RouterStore[0]>(location.pathname)
    const pathname = routerStore[0]

    const {
        isRoot, pathArrayBasenameShift
    } = patchHistory(routerStore, basename)


    const urlParams: URLparams = {}

    const ChildrenArray = []
    Layout && ChildrenArray.push({ El: Layout })

    if (isRoot) ChildrenArray.push({ El: children[''].Page })
    else {
        const pathArray = pathname.split('/')

        let i = basename ? pathArrayBasenameShift! + 1 : 1
        let childrenLevel = children
        for (; i < pathArray.length; i++) {
            const pathPart = pathArray[i]

            const pageParams = childrenLevel[pathPart] || childrenLevel['*']
            if (pageParams) {
                const {
                    Page, fallback, Layout, children, paramName, redirectTo, onEnter, onLeave
                } = pageParams

                if (isExists(redirectTo)) {
                    history.push!(redirectTo, pathname, true)
                    break

                } else {
                    paramName && (urlParams[paramName] = pathPart)

                    if (Page || Layout || children) {
                        if ((Page && i == pathArray.length - 1) || Layout) {
                            ChildrenArray.push({
                                onEnter, onLeave, fallback,
                                El: Layout || Page
                            })

                        } else if (children) {
                            children[''] && pathArray.push('')
                            childrenLevel = children
                        }
                    } else break
                }
            } else {
                history.push!('/', pathname, true)
                break
            }
        }
    }


    let resultElement
    for (let i = ChildrenArray.length - 1; i >= 0; i--) {
        const { El, onEnter, onLeave, fallback } = ChildrenArray[i]
        const pageParams: GetPageParams = {
            resultElement, urlParams,
            El, onEnter, onLeave, fallback
        }

        resultElement = onLeave
            ?   <PageWrap { ...pageParams } />
            :   getPageElement(pageParams)
    }


    return resultElement as JSX.Element
}


export default Router
export type { RouterProps, RoutesConfig, Page, Layout }