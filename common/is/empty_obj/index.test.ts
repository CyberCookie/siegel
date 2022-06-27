import isEmpty from './'


describe('common/is/empty', () => {
    test('empty object', () => {
        expect( isEmpty({}) ).toBe(true)
    })

    test('with fields', () => {
        expect( isEmpty({ a: 1 }) ).toBe(false)
    })
})