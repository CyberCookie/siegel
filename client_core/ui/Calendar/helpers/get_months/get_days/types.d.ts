type ChildProps = {
    calendarProps: MergedProps
    parentStore: Store
    beginOfMonth: Date
}

type AllDaysData = {
    timestamp: number
    date: number
    isSiblingMonth?: boolean
    hidden?: boolean
    isFirst?: boolean
    isLast?: boolean
    isToday?: boolean
}


export type { ChildProps, AllDaysData }