import isPrimitive from './'


describe('utils/is/primitive', () => {
    test('primitive bool', () => {
        expect( isPrimitive(false) ).toBe(true)
    })

    test('primitive string', () => {
        expect( isPrimitive('qwerty') ).toBe(true)
    })

    test('primitive undef', () => {
        expect( isPrimitive(undefined) ).toBe(true)
    })

    test('primitive null', () => {
        expect( isPrimitive(null) ).toBe(true)
    })


    test('not a primitive array', () => {
        expect( isPrimitive([]) ).toBe(false)
    })

    test('not a primitive date', () => {
        expect( isPrimitive(new Date()) ).toBe(false)
    })

    test('not a primitive obj', () => {
        expect( isPrimitive(new Date()) ).toBe(false)
    })
})