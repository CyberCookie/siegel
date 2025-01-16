import React, { Suspense, useState, useLayoutEffect } from 'react'

import isNullable from '../../../common/is/nullable'
import deepEqual, { SYMBOL__VALUES_EQUAL } from '../../../common/deep/diff'
import patchHistory from '../history'
import parsePathname from './get_children_array'

import type {
    LazyLayout, LazyPage, Page, Layout, RouterState,
    GetPageParams, RouterProps, RoutesConfig
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
    useLayoutEffect(() => () => { pageParams.onLeave!() }, [])

    return getPageElement(pageParams)
}

function toDefaultTransitionState(routerState: RouterState) {
    routerState.prevChildrenArray = []
    routerState.transitionTimeoutID = undefined

    return routerState
}

function Router(props: RouterProps) {
    const routerStore = useState<RouterState>({
        pathname: location.pathname,
        prevChildrenArray: [],
        transitionTimeoutID: undefined,
        prevPathnameParseResult: null
    })
    const [ routerState, setRouterState ] = routerStore
    const { transitionTimeoutID, prevChildrenArray, prevPathnameParseResult } = routerState
    let { pathname } = routerState

    routerState.prevPathnameParseResult = null


    patchHistory(props.basename, (newPath, state, cb) => {
        const { pathname } = routerState

        const result = parsePathname(props, newPath, state)
        const { newPathname, newHistoryState } = result

        routerState.pathname = newPathname

        if (
            pathname != newPathname
            ||  ( isNullable(newHistoryState) || isNullable(history.state)
                    ?   newHistoryState !== history.state
                    :   deepEqual(newHistoryState, history.state) != SYMBOL__VALUES_EQUAL )
        ) {

            cb(result)

            routerState.prevPathnameParseResult = result
            setRouterState({ ...routerState })
        }
    })


    const {
        childrenArray, newHistoryState, newPathname, urlParams, transitionData
    } = prevPathnameParseResult || parsePathname(props, pathname, history.state)

    if (newPathname != pathname) {
        routerState.pathname = pathname = newPathname
        history.replaceState(newHistoryState, '', newPathname)
    }


    let childrenDepth = childrenArray.length


    useLayoutEffect(() => {
        transitionTimeoutID && clearTimeout(transitionTimeoutID)
    }, [ pathname ])

    toDefaultTransitionState(routerState)

    if (transitionData && prevChildrenArray.length > childrenDepth) {
        const lastIndex = childrenDepth - 1
        if (prevChildrenArray[lastIndex].traversePath == childrenArray[lastIndex].traversePath) {
            childrenArray.push({
                El: () => '' as unknown as React.JSX.Element,
                traversePath: `${childrenArray[lastIndex].traversePath}/`,
                historyState: null
            })
            childrenDepth++
        }
    }


    let resultElement
    let isHistoryAlreadyTransitioned
    for (let i = childrenDepth - 1; i >= 0; i--) {
        const childData = childrenArray[i]
        const { El, onEnter, onLeave, fallback, traversePath, historyState } = childData

        const pageParams: GetPageParams = {
            resultElement, urlParams, El, onEnter, onLeave, fallback
        }

        resultElement = onLeave
            ?   <PageWrap { ...pageParams } />
            :   getPageElement(pageParams)


        if (transitionData) {
            const { duration, wrapperClassName, performOnHistoryStateChange } = transitionData

            routerState.prevChildrenArray[i] = { resultElement, traversePath, historyState }

            const isDiffStates = performOnHistoryStateChange
                &&  prevChildrenArray.length
                &&  prevChildrenArray[i]?.historyState != childrenArray[i].historyState


            if (
                prevChildrenArray.length
                &&  (   !prevChildrenArray[i]
                        ||  ( isDiffStates && !isHistoryAlreadyTransitioned )
                        ||  ( prevChildrenArray[i].traversePath != childrenArray[i].traversePath
                            && prevChildrenArray[i - 1].traversePath == childrenArray[i - 1].traversePath )
                    )
            ) {

                if (!transitionTimeoutID) {
                    routerState.transitionTimeoutID = (setTimeout as Window['setTimeout'])(() => {
                        setRouterState({ ...toDefaultTransitionState(routerState) })
                    }, duration)

                    routerState.prevPathnameParseResult = prevPathnameParseResult
                }

                resultElement = (
                    <div className={ wrapperClassName }
                        style={{ '--ui-route_transition_duration': `${duration}ms` } as CSSWithVariables}>

                        <div children={ prevChildrenArray![i]?.resultElement } />
                        <div children={ resultElement } />
                    </div>
                )
            }

            isHistoryAlreadyTransitioned = isDiffStates
        }
    }


    return resultElement as React.JSX.Element
}


export default Router
export type { RouterProps, RoutesConfig, Page, Layout }