import dateParse from './parse'


describe('utils/date/parse', () => {
    const _date = new Date(1)
    const year = _date.getFullYear()
    const day = _date.getDay()
    const month = _date.getMonth() + 1
    const date = _date.getDate()
    const hours = _date.getHours()
    const minutes = _date.getMinutes()
    const seconds = _date.getSeconds()
    const milliseconds = _date.getMilliseconds()

    test('parse', () => {
        expect( dateParse(_date) )
            .toEqual({
                month, date, hours, minutes, seconds, milliseconds, year, day
            })
    })

    test('parse zeroing', () => {
        expect( dateParse(_date, true) )
            .toMatchObject({
                milliseconds: '0001',
                seconds: '00',
                day
            })
    })
})