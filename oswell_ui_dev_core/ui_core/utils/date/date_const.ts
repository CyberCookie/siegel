type DateLocalization = {
    [key in 'months' | 'monthsShort' | 'days' | 'daysShort']: string[]
}

type DateLocalizationByLocale = {
    [key: string]: DateLocalization
}


const msIn = {
    day: 86400000,
    hour: 3600000,
    minute: 60000
} as const

const dateLocalizationByLocale: DateLocalizationByLocale = {
    en: {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShort: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    }
}

function extendDateLocalization(dateConstants: DateLocalizationByLocale) {
    Object.assign(dateLocalizationByLocale, dateConstants)
}


export { msIn, extendDateLocalization, dateLocalizationByLocale, DateLocalization, DateLocalizationByLocale }