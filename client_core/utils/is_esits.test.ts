import isE from './is_exists'


describe('is_exists', () => {
    test('undefined', () => {
        expect( isE(undefined) ).toBe(false)
    })

    test('null', () => {
        expect( isE(null) ).toBe(true)
    })

    test('zero', () => {
        expect( isE(0) ).toBe(true)
    })

    test('true', () => {
        expect( isE(true) ).toBe(true)
    })

    test('obj', () => {
        expect( isE({}) ).toBe(true)
    })
})