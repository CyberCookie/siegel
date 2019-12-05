type DatePartZeroing = number | string

interface DateParsedZeroing extends Indexable<DatePartZeroing> {
    month: DatePartZeroing,
    date: DatePartZeroing,
    hours: DatePartZeroing,
    minutes: DatePartZeroing,
    seconds: DatePartZeroing
}

interface DateParseNonZeroing extends DateParsedZeroing {
    year: number,
    day: number
}

/**
 * Parse provided or current date into localized separated date pieces
 * @param {string | undefined} date - any valid Date value 
 * @param {boolean} zeroing - determine whether to prefix date parts if it's < 10
 * @return {object}
*/
function dateParse(date?: string, zeroing?: boolean) {
    let localDate = date ? (new Date(date)) : new Date()

    let result: DateParsedZeroing = {
        month: localDate.getMonth() + 1,
        date: localDate.getDate(),
        hours: localDate.getHours(),
        minutes: localDate.getMinutes(),
        seconds: localDate.getSeconds()
    }

    if (zeroing) {
        for (let datePartKey in result) {
            let datePart = result[datePartKey]
            datePart < 10 && (result[datePartKey] = '0' + datePart)
        }
    }

    result.year = localDate.getFullYear()
    result.day = localDate.getDay()

    
    return result as DateParseNonZeroing
}


export default dateParse