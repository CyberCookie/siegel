type DateParsed = {
    year: number,
    day: number
}


type DatePartWithZeroPrefix = number | string

type ParsedDateKeys = 'month' | 'date' | 'hours' | 'minutes' | 'seconds'

type DateParsedWithZeroPrefix = {
    [key in ParsedDateKeys]: DatePartWithZeroPrefix
}// & Record<string, DatePartWithZeroPrefix>
// type DateParsedWithZeroPrefix = Record<ParsedDateKeys, DatePartWithZeroPrefix>


/**
 * Parse provided or current date into localized separated date pieces
 * @param {string | undefined} date - any valid Date value 
 * @param {boolean} zeroPrefix - determine whether to prefix date parts if it's < 10
 * @return {object}
*/
function dateParse(date?: string | number | Date, zeroPrefix?: boolean) {
    let localDate = date ? (new Date(date)) : new Date()

    let result: DateParsedWithZeroPrefix = {
        month: localDate.getMonth() + 1,
        date: localDate.getDate(),
        hours: localDate.getHours(),
        minutes: localDate.getMinutes(),
        seconds: localDate.getSeconds()
    }

    if (zeroPrefix) {
        for (let datePartKey in result) {
            let datePart = result[datePartKey]
            datePart < 10 && (result[datePartKey] = '0' + datePart)
        }
    }

    result.year = localDate.getFullYear()
    result.day = localDate.getDay()

    
    return result// as DateParsed
}


export default dateParse