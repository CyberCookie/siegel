import isNullable from './'


describe('common/is/nullable', () => {
    test('null', () => {
        expect( isNullable(null) ).toBe(true)
    })

    test('undefined', () => {
        expect( isNullable(undefined) ).toBe(true)
    })

    test('false', () => {
        expect( isNullable(false) ).toBe(false)
    })

    test('empty string', () => {
        expect( isNullable('') ).toBe(false)
    })

    test('zero', () => {
        expect( isNullable(0) ).toBe(false)
    })

    test('obj', () => {
        expect( isNullable({}) ).toBe(false)
    })
})