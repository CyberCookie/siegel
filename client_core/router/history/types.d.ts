import type { ParsePathname } from '../Router/types'
import type { GetFinalUrl } from '../get_final_url'
import type { RouterProps } from '../types'


type OnHistoryChange = (
    newPath: string,
    state: any,
    cb: (pathnameParseResult: ReturnType<ParsePathname>) => void
) => void
type PatchHistory = (
    /** URL prefix path */
    basename: RouterProps['basename'],

    /** Triggered when history.push or popState (navigation back button) is called */
    onHistoryChange: OnHistoryChange
) => void


type HistoryChangeCustomEventPayload = {
    state: Parameters<OnHistoryChange>[1]
    pathname: Location['pathname']
    newPathname: ReturnType<GetFinalUrl>
}


export type { PatchHistory, HistoryChangeCustomEventPayload }