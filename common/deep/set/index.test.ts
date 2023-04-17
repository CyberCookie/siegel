import '../../../global.d.ts'
import deepSet from './'


describe('common/deep/set', () => {
    test('set', () => {
        const obj = {
            a: {
                b: {
                    a: { val: 'val' }
                }
            }
        }
        deepSet(obj, [ 'a', 'b', 'a', 'val' ], 'new_value')

        expect(obj).toEqual({
            a: {
                b: {
                    a: { val: 'new_value' }
                }
            }
        })
    })

    test('set new in obj', () => {
        const obj: { a: { b?: null } } = {
            a: {}
        }
        deepSet(obj, [ 'a', 'b' ], null)

        expect(obj).toEqual({
            a: {
                b: null
            }
        })
    })
})