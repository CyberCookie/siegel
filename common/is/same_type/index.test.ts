import isSameType from './'


describe('common/is/same_type', () => {
    test('null', () => {
        expect( isSameType(null, null) ).toBe(true)
    })

    test('undefined', () => {
        expect( isSameType(undefined, undefined) ).toBe(true)
    })

    test('number', () => {
        expect( isSameType(20, 40) ).toBe(true)
    })

    test('set', () => {
        expect( isSameType(new Set(), new Set()) ).toBe(true)
    })

    test('objects', () => {
        expect( isSameType({}, {}) ).toBe(true)
    })

    test('string & new String', () => {
        expect( isSameType('', new String()) ).toBe(true)
    })

    test('null & undefined', () => {
        expect( isSameType(null, undefined) ).toBe(false)
    })

    test('null & undefined', () => {
        expect( isSameType(null, undefined) ).toBe(false)
    })

    test('false & null', () => {
        expect( isSameType(false, null) ).toBe(false)
    })

    test('object & set', () => {
        expect( isSameType({}, new Set()) ).toBe(false)
    })
})