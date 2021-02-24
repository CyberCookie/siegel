const toUTCDate = (date: Date) => {
    const corretctTimezoneDate = new Date(0)
    return date.setMinutes(corretctTimezoneDate.getTimezoneOffset())
}

export default toUTCDate