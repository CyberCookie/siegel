import isExists from '../../../common/is/exists'
import getFinalURL from '../get_final_url'
import parseBasename from '../history/parse_basename'

import type { URLparams, RoutesConfig } from '../types'
import type {
    ChildrenArrayEl, ParsePathname,
    RedirectToPathGetter, RedirectToPathObj, RedirectToPath
} from './types'


type RouteConfig = NonNullable<RoutesConfig[string]>
type ConfigPermissions = RouteConfig['permissions']
type ConfigRedirectTo = RouteConfig['redirectTo']
type ConfigTransition = RouteConfig['transition']
type ConfigChildren = RouteConfig['children']


function stripSearchParams(pathname: string) {
    const indexOfQuery = pathname.indexOf('?')

    return indexOfQuery >= 0
        ?   pathname.substring(0, indexOfQuery)
        :   pathname
}

const checkPermissions = (urlParams: URLparams, permissions: ConfigPermissions) => (
    typeof permissions == 'function'
        ?   permissions(urlParams)
        :   permissions
)

const extractRedirectData = (redirecTo: NonNullable<ConfigRedirectTo>) => {
    const typeofRedirect = typeof redirecTo

    if (typeofRedirect == 'string') {
        return {
            path: redirecTo as RedirectToPath
        }

    } else if (typeofRedirect == 'function') {
        return {
            path: (redirecTo as RedirectToPathGetter)()
        }

    } else {
        const { path, state } = redirecTo as RedirectToPathObj
        return {
            path: typeof path == 'function' ? path() : path,
            state: typeof state == 'function' ? state() : state
        }
    }
}

function handleNotFound(traversePath: string, pathname: string, children: ConfigChildren) {
    const redirecTo = children?.['*']?.redirectTo
        || (children![''] ? '/' : `/${Object.keys(children!)[0]}`)

    const { path } = extractRedirectData(redirecTo)


    return {
        newHistoryState: {
            __isNotFound: true,
            prevPath: pathname
        },
        newPathname: getFinalURL(traversePath, path)
    }
}

const parsePathname: ParsePathname = (props, pathname, newHistoryState = null) => {
    const { Layout, children, basename, transition } = props

    const { isRoot, pathArrayBasenameShift } = parseBasename(basename, pathname)

    const urlParams: URLparams = {}
    let newPathname = pathname
    let traversePath = ''
    let transitionData: ConfigTransition = transition

    const childrenArray: ChildrenArrayEl[] = []
    Layout && childrenArray.push({
        traversePath,
        historyState: newHistoryState,
        El: Layout
    })

    const pathArray = stripSearchParams(pathname).split('/')
    let i = 1
    if (history.basename && pathArrayBasenameShift) {
        i += pathArrayBasenameShift!
        isRoot && pathArray.push('')
    }

    let childrenLevel = children
    for (; i < pathArray.length; i++) {
        const pathPart = pathArray[i]
        traversePath += `/${pathPart}`

        const pageParams = childrenLevel[pathPart] || childrenLevel['*']
        if (pageParams) {
            const {
                Page, fallback, Layout, children,
                paramName, redirectTo, permissions, transition,
                onEnter, onLeave
            } = pageParams


            if (isExists(redirectTo)) {
                const shouldRedirect = isExists(permissions)
                    ?   !checkPermissions(urlParams, permissions)
                    :   true

                if (shouldRedirect) {
                    const { path, state } = extractRedirectData(redirectTo)
                    newPathname = getFinalURL(traversePath, path)
                    newHistoryState = state

                    break
                }
            }

            paramName && (urlParams[paramName] = pathPart)

            if (Page || Layout || children) {
                const isLast = i == pathArray.length - 1

                if ((Page && isLast) || Layout) {
                    childrenArray.push({
                        onEnter, onLeave, fallback, traversePath,
                        El: Layout || Page,
                        historyState: newHistoryState
                    })
                }

                if (children) {
                    if (isExists(transition)) {
                        transitionData = transition
                            ?   { ...transitionData, ...transition }
                            :   transition
                    }

                    isLast && children[''] && pathArray.push('')
                    childrenLevel = children

                } else if (!isLast) {
                    ({ newPathname, newHistoryState } = handleNotFound(traversePath, pathname, childrenLevel))
                    break
                }
            } else break
        } else {
            ({ newPathname, newHistoryState } = handleNotFound(traversePath, pathname, childrenLevel))
            break
        }
    }


    return newPathname != pathname
        ?   parsePathname(props, newPathname, newHistoryState)
        :   {
                newPathname, newHistoryState, transitionData,
                urlParams, traversePath, childrenArray
            }
}


export default parsePathname