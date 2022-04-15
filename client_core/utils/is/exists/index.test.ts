import isExists from './'


describe('utils/is/exists', () => {
    test('undefined', () => {
        expect( isExists(undefined) ).toBe(false)
    })

    test('null', () => {
        expect( isExists(null) ).toBe(true)
    })

    test('zero', () => {
        expect( isExists(0) ).toBe(true)
    })

    test('true', () => {
        expect( isExists(true) ).toBe(true)
    })

    test('obj', () => {
        expect( isExists({}) ).toBe(true)
    })
})