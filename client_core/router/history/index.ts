import isExists from '../../../common/is/exists'
import { BASENAME_UPDATE_EVENT_TYPE, NAVIGATION_UPDATE_EVENT_TYPE } from '../constants'
import getFinalURL from '../get_final_url'
import parseBasename from './parse_basename'

import type { HistoryChangeCustomEventPayload, PatchHistory } from './types'


const patchHistory: PatchHistory = (basename, onHistoryChange) => {
    const { pathname } = location

    history.push = (url, state, replaceURL) => {
        const finalURL = getFinalURL(
            typeof replaceURL == 'string' ? replaceURL : pathname,
            url
        )

        const isNotPrevented = dispatchEvent(
            new CustomEvent<HistoryChangeCustomEventPayload>(NAVIGATION_UPDATE_EVENT_TYPE, {
                detail: {
                    state, pathname,
                    newPathname: finalURL
                }
            })
        )

        isNotPrevented && onHistoryChange(finalURL, state, result => {
            const { newPathname, newHistoryState } = result
            replaceURL
                ?   history.replaceState(newHistoryState, '', newPathname)
                :   history.pushState(newHistoryState, '', newPathname)
        })
    }
    history.setURLQuery = query => {
        history.replaceState(history.state, '', `${pathname}?${query}`)
    }
    window.onpopstate = () => {
        const { pathname, search } = location
        const { state } = history

        let newPathname = pathname
        search && (newPathname += search)

        onHistoryChange(newPathname, state, result => {
            const { newHistoryState, newPathname } = result
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
            if (newBasename) {
                if (!newBasename.startsWith('/')) {
                    newBasename = '/' + newBasename

                } else if (newBasename.startsWith('//')) {
                    newBasename = newBasename.replace(/(\/){2,}/g, '/')
                }
            }

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


            return newBasename
        }
    }
}


export default patchHistory