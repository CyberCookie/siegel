//@ts-nocheck
import deepSet from './'


describe('common/deep/set', () => {
    test('set', () => {
        const obj = {
            a: {
                b: {
                    1: {
                        a: {
                            0: { val: '' }
                        }
                    }
                }
            }
        }

        deepSet(obj, [ 'a', 'b', '1', 'a', '0', 'val' ], 'new_value')

        expect(obj['a']['b'][1]['a'][0]['val'])
            .toEqual('new_value')
    })

    test('set new in obj', () => {
        const obj = {
            a: {}
        }
        deepSet(obj, [ 'a', 'b', 1 ], null)

        expect(obj['a']['b'][1])
            .toBeNull()
    })
})