type DateKeys = 'month' | 'date' | 'hours' | 'minutes' | 'seconds' | 'milliseconds' | 'year' | 'day'
type DateValues = number | string

type DateParsed = Record<DateKeys, DateValues>
type DateParse = (date: Date | number | string, zeroPrefix?: boolean) => DateParsed


const resultMaxLength: { [key in DateKeys]?: number } = {
    year: 4,
    milliseconds: 4,
    day: 1
}


/**
 * Parse date into date parts
 *
 * @param date - Date to parse
 * @param zeroPrefix - Whether to prefix parsed numbers with 0 if parsed value is less then 10
 * @returns Parsed date
 */
const dateParse: DateParse = (date, zeroPrefix) => {
    const localDate = new Date(date)

    const result: DateParsed = {
        year: localDate.getFullYear(),
        month: localDate.getMonth() + 1,
        date: localDate.getDate(),
        day: localDate.getDay(),
        hours: localDate.getHours(),
        minutes: localDate.getMinutes(),
        seconds: localDate.getSeconds(),
        milliseconds: localDate.getMilliseconds()
    }

    if (zeroPrefix) {
        for (let i = 0, keys = Object.keys(result), l = keys.length; i < l; i++) {
            const dateParseKey = keys[i] as keyof DateParsed

            const datePartStringified = String(result[dateParseKey])
            const maxLength = resultMaxLength[dateParseKey] || 2
            if (datePartStringified.length < maxLength) {
                result[dateParseKey] = datePartStringified.padStart(maxLength, '0')
            }
        }
    }


    return result as DateParsed
}


export default dateParse
export type { DateParsed, DateParse }