type DateLocalizationKeys = 'months' | 'monthsShort' | 'days' | 'daysShort'

type DateLocalization = {
    [key in DateLocalizationKeys]: string[]
}


const msIn = {
    day: 86400000,
    hour: 3600000,
    minute: 60000
}

const dateLocalizationByLocale: Record<string, DateLocalization> = {
    en: {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShort: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    }
}

function extendDateLocalization(locale: string, dateConstants: DateLocalization) {
    dateLocalizationByLocale[locale] = dateConstants
}


export { msIn, extendDateLocalization, dateLocalizationByLocale }