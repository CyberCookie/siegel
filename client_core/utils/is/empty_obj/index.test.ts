import isEmpty from './'


describe('utils/is/empty', () => {
    test('empty object', () => {
        expect( isEmpty({}) ).toBe(true)
    })

    test('with fields', () => {
        expect( isEmpty({ a: 1 }) ).toBe(false)
    })
})