type ZeroingDatePartsKeys = 'month' | 'date' | 'hours' | 'minutes' | 'seconds'
type ZeroingDatePartsVals = number | string
type DateParsedZeroed = IndexObjectKeys<ZeroingDatePartsKeys, ZeroingDatePartsVals>

type DateParsedNonZeroed = {
    year: number,
    day: number
}

interface DateParsed extends DateParsedZeroed, DateParsedNonZeroed {}


/**
 * Parse provided or current date into localized separated date pieces
 * @param date - any valid Date value 
 * @param zeroPrefix - determine whether to prefix date parts if it's < 10
 * @returns parsed date object
*/
function dateParse(date: string | number = Date.now(), zeroPrefix?: boolean) {
    let localDate = new Date(date)

    let result: DateParsedZeroed = {
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

    (result as DateParsed).year = localDate.getFullYear();
    (result as DateParsed).day = localDate.getDay()

    
    return result as DateParsed
}


export default dateParse