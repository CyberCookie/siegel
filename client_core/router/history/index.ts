import isExists from 'siegel-utils/is/exists'
import getFinalURL from '../get_final_url'
import { BASENAME_UPDATE_EVENT_TYPE } from '../Link'
import parseBasename from './parse_basename'
import type { RouterProps } from '../types'
import type { ParsePathname } from '../Router/types'


function patchHistory(
    basename: RouterProps['basename'],
    onHistoryChange: (
        newPath: string,
        state: any,
        cb: (pathnameParseResult: ReturnType<ParsePathname>) => void
    ) => void
) {

    const { pathname } = location

    history.push = (url, state, replaceURL) => {
        const finalURL = getFinalURL(
            typeof replaceURL == 'string' ? replaceURL : pathname,
            url
        )

        onHistoryChange(finalURL, state, result => {
            const { newPathname, newHistoryState } = result
            replaceURL
                ?   history.replaceState(newHistoryState, '', newPathname)
                :   history.pushState(newHistoryState, '', newPathname)
        })
    }
    window.onpopstate = () => {
        const { pathname } = location
        const { state } = history
        onHistoryChange(pathname, state, result => {
            const { newPathname, newHistoryState } = result
            history.replaceState(newHistoryState, '', newPathname)
        })
    }


    if (isExists(basename)) {
        const { finalBasename } = parseBasename(basename, pathname)

        history.basename = finalBasename
        if (!pathname.startsWith(finalBasename)) {
            history.push!(pathname, null, true)
        }


        history.updateBasename = newBasename => {
            const { basename } = history
            if (newBasename != basename) {
                history.basename = newBasename

                history.push!(
                    pathname.replace(basename!, '') || '/',
                    {
                        __basenameUpdate: true,
                        prevPath: pathname
                    }
                )

                dispatchEvent(
                    new CustomEvent(BASENAME_UPDATE_EVENT_TYPE)
                )
            }
        }
    }
}


export default patchHistory