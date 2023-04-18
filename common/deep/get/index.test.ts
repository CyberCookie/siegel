import '../../../global.d.ts'
import deepGet from './'


describe('common/deep/get', () => {
    test('get', () => {
        expect(
            deepGet(
                {
                    a: {
                        b: {
                            a: { val: 'val' }                        }
                    }
                },
                [ 'a', 'b', 'a', 'val' ]
            )
        ).toBe('val')
    })

    test('get not exists', () => {
        expect(
            deepGet(
                { a: {} as { b?: number } },
                [ 'a', 'b' ]
            )
        ).toBeUndefined()
    })

    test('get undefined', () => {
        expect(
            deepGet(
                { a: null },
                [ 'a' ]
            )
        ).toBeUndefined()

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
                { a: {} as { b?: number } },
                [ 'a', 'b' ],
                '__FALLBACK__'
            )
        ).toBe('__FALLBACK__')
    })
})