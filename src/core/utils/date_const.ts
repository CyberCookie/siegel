type DateLocalizationKeys = 'months' | 'monthsShort' | 'days' | 'daysShort'

type DateLocalizationByLocale = {
    [key: string]: {
        [key in DateLocalizationKeys]: string[]
    }
}


const msIn: Readonly<Indexable<number>> = {
    day: 86400000,
    hour: 3600000,
    minute: 60000
}

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


export { msIn, extendDateLocalization, dateLocalizationByLocale }