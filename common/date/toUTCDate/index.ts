/**
 * Adjust hours in date object to match UTC date
 *
 * @param date date to adjust
 * @returns adjusted date
 */
const toUTCDate = (date: Date) => {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    return date
}


export default toUTCDate