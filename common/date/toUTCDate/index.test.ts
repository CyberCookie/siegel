import toUTCDate from './'


describe('common/date/toUTCDate', () => {
    const date = new Date()
    const dateTimestamp = date.getTime()
    const timezoneShift = Math.abs(date.getTimezoneOffset())

    const dateAdjusted = toUTCDate(date)
    const dateAdjustedTimestamp = date.getTime()


    test('adjust', () => {
        expect( Math.abs(dateTimestamp - dateAdjustedTimestamp) )
            .toBe( timezoneShift * 60 * 1000 )
    })

    test('returns type of date', () => {
        expect( dateAdjusted.constructor ).toBe(Date)
    })
})