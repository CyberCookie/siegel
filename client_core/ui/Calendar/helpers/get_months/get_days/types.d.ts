import type { MergedProps, Store } from '../../../types'


type ChildProps = {
    calendarProps: MergedProps
    parentStore: Store
    beginOfMonth: Date
}


export type { ChildProps }