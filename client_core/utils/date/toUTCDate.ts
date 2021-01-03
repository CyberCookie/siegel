const toUTCDate = (date: Date) => date.setMinutes(date.getTimezoneOffset())

export default toUTCDate