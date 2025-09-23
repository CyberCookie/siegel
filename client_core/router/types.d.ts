//TODO typings


declare global {
    interface History {
        push?(
            url: string,
            state?: any,
            replaceURL?: boolean | string,
            _skipSetState?: boolean
        ): void
        basename?: string
        updateBasename?(newBasename: string): string
        setURLQuery?(query: URLSearchParams | string): void
    }
}


export type {
    RouterProps, RoutesConfig, Page, Layout, URLparams
} from './Router/types'
export type { HistoryChangeCustomEventPayload } from './history/types'