//@ts-nocheck
import deepGet from './'


describe('common/deep/get', () => {
    test('get', () => {
        expect(
            deepGet(
                {
                    a: {
                        b: {
                            1: {
                                a: {
                                    0: {
                                        val: 'val'
                                    }
                                }
                            }
                        }
                    }
                },
                [ 'a', 'b', '1', 'a', '0', 'val' ]
            )
        ).toBe('val')
    })

    test('get not exists', () => {
        expect(
            deepGet(
                { a: {} },
                [ 'a', 'b', '1' ]
            )
        ).toBeUndefined()

        expect(
            deepGet(
                { a: null },
                [ 'a', 'b', '1' ]
            )
        ).toBeUndefined()

        expect(
            deepGet(
                undefined,
                [ 'a', 'b', '1' ]
            )
        ).toBeUndefined()
    })

    test('get undefined', () => {
        expect(
            deepGet(
                { a: undefined },
                [ 'a' ]
            )
        ).toBeUndefined()
    })

    test('get not exists fallback', () => {
        expect(
            deepGet(
                { a: {} },
                [ 'a', 'b', '1' ],
                '__FALLBACK__'
            )
        ).toBe('__FALLBACK__')
    })
})