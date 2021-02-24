type Months = [ string, string, string, string, string, string, string, string, string, string, string, string ]
type WeekDays = [ string, string, string, string, string, string, string ]

type DateResolver = () => {
    readonly months: Months
    readonly monthsShort?: Months
    readonly weekDays?: WeekDays
    readonly weekDaysShort: WeekDays
}
type DateLocales = {
    get: Indexable<DateResolver>
    set(key: string, resolver: DateResolver): void
}


const msIn = {
    day: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000
} as const

const dateLocales: DateLocales = {
    get: {
        en: () => ({
            months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
            monthsShort: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
            weekDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            weekDaysShort: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        })
    },

    set(key: string, resolver) {
        this.get[key] = resolver
    }
}


export { msIn, dateLocales }
export type { DateResolver, Months, WeekDays }