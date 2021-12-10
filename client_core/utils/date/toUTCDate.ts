const toUTCDate = (date: Date) => {
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    return date
}


export default toUTCDate