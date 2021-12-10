type DateKeys = 'month' | 'date' | 'hours' | 'minutes' | 'seconds' | 'milliseconds' | 'year' | 'day'
type DateValues = number | string

type DateParsed = Record<DateKeys, DateValues>
type DateParse = (date: Date | number | string, zeroPrefix?: boolean) => DateParsed


const resultMaxLength: { [key in DateKeys]?: number } = {
    year: 4,
    milliseconds: 4,
    day: 0
} as const

/**
 * Parse provided date (default is current date) into localized separated date pieces
 * @param date - any valid Date value
 * @param zeroPrefix - determine whether to prefix date parts with zeroes
 * @returns parsed date object
*/
const dateParse: DateParse = (date = Date.now(), zeroPrefix) => {
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
        for (const datePartKey in result) {
            const maxLength = resultMaxLength[datePartKey as keyof DateParsed]
            if (maxLength != 0) {
                result[datePartKey as DateKeys] = result[datePartKey as DateKeys]
                    .toString()
                    .padStart(maxLength || 2, '0')
            }
        }
    }


    return result as DateParsed
}


export default dateParse
export type { DateParsed, DateParse }