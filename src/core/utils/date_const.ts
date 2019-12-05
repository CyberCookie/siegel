type dateLocalizationByLocale = {
    months: string[],
    monthsShort: string[],
    days: string[],
    daysShort: string[]
}


const msIn = {
    day: 86400000,
    hour: 3600000,
    minute: 60000
}

const dateLocalization: Record<string, dateLocalizationByLocale> = {
    en: {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        daysShort: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    }
}

function extendDateLocalization(locale: string, dateConstants: dateLocalizationByLocale) {
    dateLocalization[locale] = dateConstants
}


export { msIn, extendDateLocalization, dateLocalization }